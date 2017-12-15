angular.module('transposedGridModule')

    /**
     * Configuration for the custom widget
     * The config contains all configurable properties of the widget
     */
    .config(['dashboardProviderProvider','columnTypeConfigUrlServiceProvider',
        function (dashboardProviderProvider, columnTypeConfigUrlServiceProvider) {
            dashboardProviderProvider.widget('transposedGrid', {
                title: 'Transposed Grid',
                category: 'customWidget',
                toolTip : {
                    "de":"Transposed Grid",
                    "en":"Transposed Grid"
                },
                actions: ['assignData', 'filter',
                    'editName',
                    'hLine',
                    'copy', 'paste', 'cut', 'delete',
                    'toTop', 'bringForward', 'sendBackward', 'toBack',
                    'hideHeader','hideBorder'
                ],
                description: 'Transposed Grid',
                templateUrl: 'widgets/customWidgets/transposedGrid/partials/transposedGrid.html',
                iconUrl: 'widgets/customWidgets/transposedGrid/assets/images/transposedGridMenuIcon_32x32.png',
                controller: 'transposedGridCtrl',
                container: {
                    hideHeader: false,
                    hideBorder: false,
                    width: 400,
                    height: 300,
                    contentMinHeight: 60,
                    contentMinWidth: 60
                },
                assignData: 'widgets/customWidgets/transposedGrid/partials/assignDataDialog/assignData.html',
                assignColumns: 'widgets/customWidgets/transposedGrid/partials/assignDataDialog/assignColumns.html',
                advancedProperties: 'widgets/customWidgets/transposedGrid/partials/assignDataDialog/advancedProperties.html',
                resolve: {
                    widgetInterface: function(config, transposedGridDataService) {
                        config.widgetInterface = {
                            getDataMapping: transposedGridDataService.getDataMapping
                        };
                    }
                }
            });

            columnTypeConfigUrlServiceProvider.addColumnTypeUrlMapByWidget('transposedGrid',
                {
                    NUMERIC : ['widgets/customWidgets/transposedGrid/partials/assignDataDialog/columnTypeConfigTemplates', 'numeric.html'].join('/'),
                    DATE : ['widgets/customWidgets/transposedGrid/partials/assignDataDialog/columnTypeConfigTemplates', 'date.html'].join('/'),
                    TEXT : ['widgets/customWidgets/transposedGrid/partials/assignDataDialog/columnTypeConfigTemplates', 'text.html'].join('/')
                });
        }
    ]);