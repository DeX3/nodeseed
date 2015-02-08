"use strict";

var app = angular.module( "yourapp" );

app.config( function( $stateProvider,
                      $urlRouterProvider,
                      $breadcrumbProvider ) {

    $breadcrumbProvider.setOptions( {
        includeAbstract: true
    } );
    
    $urlRouterProvider.otherwise( "users" );
    $stateProvider
        .state( "users", {
            url: "/users",
            abstract: true,
            template: "<ui-view />",
            ncyBreadcrumb: {
                label: "Users"
            }
        } ).state( "users.index", {
                url: "",
                templateUrl: "public/views/users/index.html",
                controller: "UserIndexCtrl",
                ncyBreadcrumb: {
                    label: "List"
                }
            } )
            .state( "users.edit", {
                url: "/:id",
                templateUrl: "public/views/users/edit.html",
                controller: "UserEditCtrl",
                ncyBreadcrumb: {
                    label: "{{user.$isNew? 'New' : 'Edit'}}"
                }
            } );
} );

