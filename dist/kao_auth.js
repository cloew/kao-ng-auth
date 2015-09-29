$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  angular.module("kao.auth", ["kao.utils", "kao.nav"]).service("UserService", function($http, $window, $rootScope, NavService, KaoDefer) {
    var user = void 0;
    var responseHandler = function(promise) {
      var deferred = KaoDefer();
      promise.success(function(data) {
        if (data.error) {
          deferred.reject(data.error);
        } else {
          user = data.user;
          $window.localStorage.token = data.token;
          deferred.resolve(user);
        }
      }).error(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    this.login = function(loginInfo) {
      return responseHandler($http.post("/api/login", loginInfo));
    };
    this.register = function(user) {
      return responseHandler($http.post("/api/users", user));
    };
    this.update = function(user) {
      return responseHandler($http.put("/api/users/current", user));
    };
    this.logout = function() {
      delete $window.localStorage.token;
      user = void 0;
      $rootScope.$broadcast("user-logout");
      NavService.login.goTo();
    };
    this.isLoggedIn = function() {
      return typeof $window.localStorage.token !== "undefined" && $window.localStorage.token !== null;
    };
    this.withUser = function() {
      var deferred = KaoDefer();
      if (!!this.isLoggedIn() && !(typeof user !== "undefined" && user !== null)) {
        $http.get("/api/users/current").success(function(data) {
          user = data.user;
          deferred.resolve(user);
        }).error(function(error) {
          deferred.reject(error);
        });
      } else {
        deferred.resolve(user);
      }
      return deferred.promise;
    };
  }).service("AuthRejected", function($location, NavService) {
    return {toLogin: function() {
        var returnToPath = $location.path();
        NavService.login.goTo().search("returnTo", returnToPath);
      }};
  }).factory("authInterceptor", function($rootScope, $q, $window, AuthRejected) {
    return {
      request: function(config) {
        config.headers = config.headers == null ? {} : config.headers;
        if ($window.localStorage.token) {
          config.headers.Authorization = "Bearer " + $window.localStorage.token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          AuthRejected.toLogin();
        }
        return $q.reject(rejection);
      }
    };
  }).service("requireAuth", function(UserService, AuthRejected) {
    return function(event) {
      if (!UserService.isLoggedIn()) {
        event.preventDefault();
        AuthRejected.toLogin();
      }
    };
  }).config(function($httpProvider) {
    $httpProvider.interceptors.push("authInterceptor");
  });
  return {};
});

//# sourceMappingURL=kao_auth.map
