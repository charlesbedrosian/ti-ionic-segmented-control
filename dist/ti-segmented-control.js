angular.module('ti-segmented-control', []
).directive('tiSegmentedControl', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            onSelect: "&",
            allowMultiSelect: "@multiselect"
        },
        template: '<div class=\"buttons\"><div class=\"button-bar bar-light ti-segmented-control\" ng-transclude></div></div>',

        controller: function($scope){
            this.buttons = [];
            this.selectedButtons = [];
            this.allowMultiSelect = $scope.allowMultiSelect || false;
            this.setSelectedButton = function (title) {
                $scope.onSelect({$index: this.buttons.indexOf(title)});
            };
            var style = window.document.createElement('style');
            style.type = 'text/css';
            style.innerHTML += '.button.button-outline.ti-segmented-control:first-child { border-top-left-radius: 5px;border-bottom-left-radius: 5px; }';
            style.innerHTML += '.button.button-outline.ti-segmented-control { line-height: 23px;max-height: 25px;min-height: 25px; }';
            style.innerHTML += '.button.button-outline.ti-segmented-control:last-child { border-top-right-radius: 5px; border-bottom-right-radius: 5px; }';
            style.innerHTML += '.button.button-outline.ti-segmented-control.activated { color: #fafafa;box-shadow: none; }';
            window.document.getElementsByTagName('head')[0].appendChild(style);
        },
        link: function (scope) {
        }
    }
}).directive('tiSegmentedControlButton', function () {
    return {
        replace: true,
        require: '^tiSegmentedControl',
        scope: {
            title: '@title',
            value: '@value'
        },
        template: '<a class=\"button button-outline ti-segmented-control\">{{title}}</a>',
        link: function(scope, element, attr, segmentedControlCtrl){
            var val = scope.value || scope.title;
            segmentedControlCtrl.buttons.push(val);
            var selectedValues = segmentedControlCtrl.value || '';
            var isSelected = (selectedValues.split(',').indexOf(val) > -1);
            if(isSelected || attr.selected != undefined) element.addClass('active');

            element.bind('click', function(){
              segmentedControlCtrl.setSelectedButton(scope.value || scope.title);
              if (segmentedControlCtrl.allowMultiSelect) {
                if (element.hasClass('active')) {
                  element.removeClass('active');
                } else {
                  element.addClass('active');
                }
                var selected = [];
                var buttons = angular.element(angular.element(element.parent()[0]).children());
                for (var i = 0; i < buttons.length; i++) {
                  if (angular.element(buttons[i]).hasClass('active')) {
                    selected.push(angular.element(buttons[i]));
                  }
                }
                segmentedControlCtrl.selectedButtons = selected;

              } else {
                var buttons = angular.element(angular.element(element.parent()[0]).children());
                for (var i = 0; i < buttons.length; i++) {
                  angular.element(buttons[i]).removeClass('active');
                }
                element.addClass('active');
              }
            });
        }
    }
});
