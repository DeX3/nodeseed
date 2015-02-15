"use strict";

var Checkit = require( "checkit" );
var bookshelf = require( "./BaseModel" );
var crypto = require( "crypto" );
var rand = require( "csprng" );
var _ = require( "underscore" );

// make sure the role-model is loaded
require( "./Role" );

var validator = new Checkit( {
    email: ["required", "email"]
} );

var User = bookshelf.model( "User", {
    tableName: "users",

    roles: function() {
        return this.belongsToMany( "Role" );
    },

    validate: function() {
        return validator.run( this.toJSON( { shallow: true } ) );
    },


    saving: function( model, attrs, options ) {

        var ret = bookshelf.Model.prototype.saving.apply( this, arguments );

        var salt;
        if( this.isNew() ) {
            salt = rand( 512, 36 );
            model.set( "salt", salt );
        } else {
            salt = model.get( "salt" );
        }

        if( this.changed.password ) {
            var sha = crypto.createHash( "sha512" );
            sha.update( this.changed.password + salt );
            
            model.set( "pwhash", sha.digest( "hex" ) );
        }

        return ret;
    },

    hasPassword: function( password ) {
        
        var sha = crypto.createHash( "sha512" );
        sha.update( password + this.get("salt") );

        var digest = sha.digest( "hex" );

        return digest === this.get("pwhash");
    },
    logout: function() {
        return this.save( { session: null }, { patch: true } );
    },

    can: function( permission ) {
        
        return this.fetch( {
            withRelated: ["roles","roles.permissions"]
        } ).then( function(user) {
            return _.some( user.toJSON().roles, function( role ) {
                return _.some( role.permissions, function( p ) {
                    return p.name === permission;
                } );
            } );
        } );
    }
}, {
    sensitiveData: ["pwhash", "salt", "session", "deleted" ],
    login: function( username, password, sessionId ) {
        return bookshelf.transaction( function( tx ) {

            //search for the user with the given username
            return User.where(
                { email: username }
            ).fetch(
                { transacting: tx }
            ).then( function( user ) {

                if( !user ) {
                    //if the no user with the username exists
                    return null;
                }

                if( user.hasPassword(password) ) {
                
                    return user.save(
                        { session: sessionId },
                        { patch: true, transacting: tx }
                    ).return( user );
                } else {
                    //password incorrect
                    return null;
                }
            } );
        } );
    },

    bySession: function( token ) {
        return User.where(
            { session: token }
        );
    }
} );

module.exports = User;
