/**
 * @class Ext.ux.grid.JsonExport
 * @author George Alexandru Dudau (gxg1974@gmail.com)
 * Helper class to create a json object for create XLSX file with
 * PHPExcel
 * 
 * This class is based on Printer.js (Ext.ux.grid.Printer) - Ed Spencer (edward@domine.co.uk)
 * Original url: http://edspencer.net/2009/07/printing-grids-with-ext-js.html
 * Full credits in CREDITS.txt
 * 
 * Usage:
 * 1 - Add Ext.Require Before the Grid code
 * Ext.require([
 *   'Ext.ux.grid.JsonExport',
 * ]);
 * 
 * 2 - Set path of Ext.ux
 * Ext.Loader.setConfig({
 *   enabled: true,
 *   paths: {
 *           'Ext.ux': 'path/to/ux'
 *   }
 * });
 * 
 * 3 - Create your Grid 
 * var grid = Ext.create('Ext.grid.Panel', {
 *   columns: //some column model,
 *   store   : //some store
 * });
 * 
 * 4 - Export to XLSX (create a handler)
 * 
 * 
 * handler : function() {
 *   var url = "http://www.example.com/export_xlsx.php";
 *   Ext.ux.grid.JsonExport.print(grid,url);
 * }
 *
 * 
 * Ext.ux.grid.Printer.print(grid,url);
 * 
 * LICENCE - GPL v3 (see LICENCE.txt)
 */
Ext.define("Ext.ux.grid.JsonExport", {
    statics: {
        print: function (grid, url) {
			
            var isGrouped = grid.store.isGrouped ? grid.store.isGrouped() : false;
            var groupField;
            if (isGrouped) {
                var feature = this.getFeature(grid, 'grouping');
                if (feature) {
                    groupField = feature.getGroupField();
                } else {
                    isGrouped = false; // isGrouped turned off if grouping feature not defined
                }
            }
            if (grid.columnManager) {
                // use the column manager to get the columns.
                var columns = grid.view.headerCt.getVisibleGridColumns();

            } else {
                var columns = [];
                Ext.each(grid.columns, function (c) {
                    if (c.items && c.items.length > 0) {
                        columns = columns.concat(c.items.items);
                    } else {
                        columns.push(c);
                    }
                });

            }
            
            // TODO create grouping 
            
            var title = (!grid.title) ? "Grid Export" : grid.title;

            var data = [];
            var clearColumns = [];

            Ext.each(columns,

            function (column) {
                if (column) {
                    if (!Ext.isEmpty(column.dataIndex) && !column.hidden && !isGrouped) {
                        clearColumns.push(column);
                    } else if (column.xtype === 'rownumberer') {
                        if (!column.text) column.text = 'Row';
                        clearColumns.push(column);
                    } else if (column.xtype === 'templatecolumn') {
                        clearColumns.push(column);
                    } else if (isGrouped && column.dataIndex !== groupField && column.xtype !== 'actioncolumn') {
                        clearColumns.push(column);
                    }
                }
            });
            columns = clearColumns;
            var a = grid.getStore().data.items;
            var d = [],
                e = [],
                type = [],
                data = [],
                c = {};
            var rows = grid.view.getNodes();


            for (var j = 0; j < columns.length; j++) {
                if (columns[j].xtype !== 'rownumberer') {

                    d.push(columns[j].text);
                    e.push(columns[j].dataIndex);
                    // TODO - create xlsx column type based on grid columns type
                    // type.push(columns[j].filter.type);
                }
            }


            for (var ai = 0; ai < a.length; ai++) {
                var raw = a[ai].data;
                var x = [];
                for (var ae = 0; ae < e.length; ae++) {
                    x.push(raw[e[ae]]);
                }
                data.push(x);
            }

            c.data = data;
            c.titlu = title;
            c.metadata = {
                'text': d,
                    'title': title
            }
			
            //console.log(c);

            // Creez form
            var mapForm = document.createElement("form");
            mapForm.target = "_blank";
            mapForm.method = "POST";
            mapForm.action = url;
            // Creez input
            var mapInput = document.createElement("input");
            mapInput.type = "text";
            mapInput.name = "xlsdata";
            mapInput.value = JSON.stringify(c);

            // Adaug input in form
            mapForm.appendChild(mapInput);

            // Adaug formularul in dom
            document.body.appendChild(mapForm);

            // Submit
            mapForm.submit();
            mapForm.remove();

        },
        getFeature: function (grid, featureFType) {
            var view = grid.getView();

            var features;
            if (view.features) features = view.features;
            else if (view.featuresMC) features = view.featuresMC.items;
            else if (view.normalView.featuresMC) features = view.normalView.featuresMC.items;

            if (features) for (var i = 0; i < features.length; i++) {
                if (featureFType == 'grouping') if (features[i].ftype == 'grouping' || features[i].ftype == 'groupingsummary') return features[i];
                if (featureFType == 'groupingsummary') if (features[i].ftype == 'groupingsummary') return features[i];
                if (featureFType == 'summary') if (features[i].ftype == 'summary') return features[i];
            }
            return undefined;
        }

    }

});
