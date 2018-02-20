angular.module('extendedLabelWidgetModule')

/**
 * Controller for the Assign Data Dialog
 */
.controller('extendedLabelWidgetAssignDataCtrl',['$scope', 'aggregationConstants', 'typeconstants', 'numberFormatConstants', 'thresholdConstants',
    function($scope, aggregationConstants, typeconstants, numberFormatConstants, thresholdConstants) {
        $scope.selectedColumn = null;

        $scope.clearSelection = function() {
            $scope.selectedColumn = null;
        };
        
        $scope.columnSelectionHandler = function(column) {
            $scope.clearSelection();
            // if (column.type == 'NUMERIC' && !column.aggregation) {
            // }
            $scope.selectedColumn = column;

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
            return $scope.selectedColumn === column;
        };
    }]);
