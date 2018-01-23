angular.module('simpleMapWidgetModule')

/**
 * Controller for the Assign Data Dialog
 */
.controller('simpleMapWidgetAssignDataCtrl',['$scope', 'aggregationConstants', 'typeconstants', 'numberFormatConstants', 'thresholdConstants',
    function($scope, aggregationConstants, typeconstants, numberFormatConstants, thresholdConstants) {
        $scope.statusHeaderSelected = false;
        $scope.iconHeaderSelected = false;
        $scope.selectedColumn = null;

        $scope.clearSelection = function() {
            $scope.statusHeaderSelected = false;
            $scope.iconHeaderSelected = false;
            $scope.selectedColumn = null;
        };
        
        $scope.columnSelectionHandler = function(column) {
            $scope.clearSelection();
            // if (column.type == 'NUMERIC' && !column.aggregation) {
            // }
            $scope.selectedColumn = column;

        };
        
        $scope.selectIconHeader = function() {
            // $scope.clearSelection();
            $scope.statusHeaderSelected = false;
            $scope.iconHeaderSelected = true;
        };

        $scope.selectStatusHeader = function() {
            // $scope.clearSelection();
            $scope.statusHeaderSelected = true;
        };

        $scope.showColorThreshold = function() {
            return $scope.statusHeaderSelected;
            //  || $scope.isSelected($scope.itemClone.config.dataMapping.statusColumn);
        };

        $scope.showIconEdit = function() {
            return $scope.iconHeaderSelected || $scope.isSelected($scope.itemClone.config.dataMapping.typeColumn);
        };

        /**
         * Is called after the user drops a column in the component configu
         * @param column
         */
        $scope.columnDropHandler = function(column, allowThreshold) {
            column.newName = column.name;
            if(column.type === typeconstants.NUMBER){
                if(!column.aggregation) {
                    column.aggregation = aggregationConstants.NO;
                }
                if(!column.format) {
                    column.format = numberFormatConstants.NUMERIC_FORMAT_PATTERNS[0];
                }
                column.round = false;
            } else if(column.type === typeconstants.DATE){
                column.format = "yyyy-MM-dd'T'HH:mm:ss";
            }
            $scope.columnSelectionHandler(column, allowThreshold);
        };

        /**
         * Is called if the user clicks on the trash icon of a column
         * @param column The column that should be deleted
         */
        $scope.columnDeleted = function(column) {
            if ($scope.selectedColumn === column) {
                delete $scope.selectedColumn;
                // TODO: what happens when more than one column are configured with thresholds?
                // $scope.itemClone.config.properties.thresholdConfig.thresholds = angular.copy(thresholdConstants.defaultThresholds);
            }
        };

        /**
         * Indicates if a column should be marked as selected
         * @param column The column to check
         * @returns {boolean} true if the column should be selected, otherwise false
         */
        $scope.isSelected = function(column) {
            return ($scope.statusHeaderSelected || $scope.iconHeaderSelected) ? false : $scope.selectedColumn === column;
        };

        // $scope.addIconSetting = function() {
        //     $scope.itemClone.config.properties.iconConfig.settings.push({
        //         shape: "fontAwesomePaddle",
        //         label: "\uf08d", // pin
        //         value: ""
        //     });
        // };

        $scope.removeIconSetting = function() {
            $scope.itemClone.config.properties.iconConfig.settings.pop();
        }
    }]);
