$(function() {
  "use strict";

  BrainBrowser.SurfaceViewer.start("brainbrowser", function(viewer) {
  
  	//Add an event listener.
  	BrainBrowser.events.addEventListener("displaymodel", function(model) {
    	console.log("We have a model!");
  	});
 
  	// Start rendering the scene.
  	viewer.render();
 
	// Load a model into the scene.
  	// viewer.loadModelFromURL("/models/brain-surface.obj");
    viewer.loadModelFromURL("/models/surfaces/ASCII_surfaces/lh.pial.asc", {
      format: "freesurferasc",
      complete: function() {
        alert("Image has been loaded");
        /*
        viewer.loadIntensityDataFromURL("models/freesurfer-thickness.asc", {
          format: "freesurferasc",
          name: "Cortical Thickness"
        });
      */
      }
    }); 

  	// Load a color map (required for displaying intensity data).
  	viewer.loadColorMapFromURL(BrainBrowser.config.get("color_maps")[0].url);

    $("#brainbrowser").click(function(event) {
      var pick_info = viewer.pick();
      if (pick_info) {
        var x = pick_info.point.x;
        var y = pick_info.point.y;
        var z = pick_info.point.z;
        var index = pick_info.index;
        console.log(pick_info);
        var vertex = {x:x, y:y, z:z, index:index};
        //alert("You clicked on vertex with index: " + vertex.index);
        $.get("givemethelabel", {index: index}, function(data) {
          //alert(data.label + data.color); 
          var splitted = data.label.split(".");
          var region = splitted[1];
          $("#region").html(region);
          $("#selectedColor").html(data.color);
        });      
      }
    }); 
  	
  });

  $.getJSON("niftiList", function(data) {
            var list = "";
            $.each(data, function(i, field) {
                list = field;
            });
            var parts = list.split("!");
            $.each (parts, function (i, field) {
                if (field.match(".nii.gz")) {
                    var min = field + ".min.gif";
                    // var option = $("<option value='" + field + "'>" + field + "</option>");
                    // $("#selectNii").append(option);
                    // var li = $("<li></li>");
                    // var img = $("<img src='" + min + "' height='45' width='45'/>");
                    // li.append(img);
                    // $("#previewImg").append(li);
                    var tr = $("<tr></tr>");
                    var td1 = $("<td></td>");
                    var td2 = $("<td></td>");
                    var td3 = $("<td></td>");
                    var checkbox = $("<input type='checkbox' name='selectNii' id='selectNii' value='" + field + "' />");
                    var name = $("<p> " + field + " </p>");
                    var img = $("<img src='" + min + "' height='45' width='45'/>");
                    td1.append(checkbox);
                    td2.append(name);
                    td3.append(img);
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    $("#niftiTable").append(tr);
                }
            });
  });  

  $("#search").click(function () {
            var color1 = $("#selectedColor").html();
            var splitted = color1.split(" ");
            var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
            // var filename = $("#selectNii").find(":selected").text();
            var filename = $("#selectNii:checked").val();
            console.log("color to be sended -> " + color + " and filename -> " + filename);
            var input = $("<input type='hidden' id='color' name='color' value='" + color + "'/>" );
            var input2 = $("<input type='hidden' id='filename' name='filename' value='" + filename + "' />");
            $("#form").append(input);
            $("#form").append(input2);
            $("#form").submit();
  });

});


