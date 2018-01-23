angular.module('simpleMapWidgetModule')

.config(['dashboardProviderProvider', 'columnTypeConfigUrlServiceProvider', function(dashboardProviderProvider, columnTypeConfigUrlServiceProvider) {
  dashboardProviderProvider.widget('simpleMapWidget', {
    title: 'Simple Map Widget',
    category: 'Map',
    toolTip: {
      "de": "Leaflet Maps Widget!",
      "en": "Leaflet Maps Widget!"
    },
    actions: [
      'editName',
      'assignData', 'filter',
      'hLine',
      'editStyle',
      'hLine',
      // 'editLocation',
      'selectMapItems',
      'hLine',
      'isGlobal',
      'hLine',
      'copy', 'paste', 'cut', 'delete',
      'toTop', 'bringForward', 'sendBackward', 'toBack',
      'hideHeader', 'hideBorder',
      "actions"
    ],
    description: 'Map widget based on the Leaflet library and OpenStreetMaps',
    templateUrl: 'widgets/customWidgets/simpleMapWidget/partials/simpleMapWidget.html',
    iconUrl: 'widgets/customWidgets/simpleMapWidget/assets/images/menu_icon_32x32.png',
    controller: 'simpleMapWidgetCtrl',
    resolve: {
      widgetInterface: function(config, simpleMapWidgetDataService) {
        config.widgetInterface = {
          getDataMapping: simpleMapWidgetDataService.getDataMapping,
          calculateCoordinateList: simpleMapWidgetDataService.calculateCoordinateList
        };
      }
    },
    actionResolver: {
      resolveAction: function(actionKey) {
        if (actionKey === "editLocation") {
          return {
            name: 'Location',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/editLocation.html'
          };
        } else if (actionKey === "editStyle") {
          return {
            name: 'Style',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/editStyle.html'
          };
        } else if (actionKey === "selectMapItems") {
          return {
            name: 'Map Items',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/selectMapItems.html'
          };
        }
      }
    },
    actionFramework: {
      getActionTriggers: function(widgetConfig, filter) {
        return [{
          key: 'onSelectionChange',
          name: filter("widgetResources")("ACTIONS_ON_SELECTION_CHANGE")
        }];
      }
    },
    assignData: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/assignData.html',
    assignColumns: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/assignColumns.html',
    columnProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnProperties.html',
    advancedProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/advancedProperties.html',
    //thresholdProperties: 'widgets/customWidgets/advancedWidget/partials/assignDataDialog/thresholdProperties.html',
    colorProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/colorProperties.html',
    iconProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/iconProperties.html',
    viewModeActions: ['deleteSelection', 'pause'],
    container: {
      hideHeader: false,
      hideBorder: false,
      width: 600,
      height: 450,
      contentMinHeight: 60,
      contentMinWidth: 60
    }
  });
  columnTypeConfigUrlServiceProvider.addColumnTypeUrlMapByWidget('simpleMapWidget', {
    NUMERIC: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'numeric.html'].join('/'),
    DATE: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'date.html'].join('/'),
    TEXT: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'text.html'].join('/')
  });
}]);