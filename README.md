## JsonExport
JsonExport - Helper class for EXTJS 5  for generate XLSX/XLS file with PHPExcel

###Author - George Alexandru Dudau

Require: PHPExcel (https://phpexcel.codeplex.com/)

### How to
#####1. Add Ext.Require Before the Grid code

    Ext.require([
      'Ext.ux.grid.JsonExport'
    ]);
#####2. Set path of Ext.ux

       Ext.Loader.setConfig({
         enabled: true,
          paths: {
            'Ext.ux': 'path/to/ux'
          }
       });
       
#####3. Create your grid
      
      var grid = Ext.create('Ext.grid.Panel', {
         columns: //some column model,
         store   : //some store
      });

#####4. Export to XLSX (create a handler)

      handler : function() {
          var url = "http://www.example.com/export_xlsx.php";
          Ext.ux.grid.JsonExport.print(grid,url);
      }
      
      

