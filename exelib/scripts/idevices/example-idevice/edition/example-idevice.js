/**
 * Example iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// i18n
	i18n : {
		
		// Spanish
		es : {
			"The user will see your name when clicking on the button." : "El usuario verá tu nombre cuando haga clic en el botón.",
			"The text of the button should be in the right language, that's why it's a required field." : "El texto del botón debe estar en el idioma adecuado, por eso es un campo requerido.",
			"Write your name:" : "Escribe tu nombre:",
			"Button text:" : "Texto del botón:",
			"You should write your name." : "Debes escribir tu nombre.",
			"You should write the button text." : "Debes escribir el texto del botón."
		}
		
	},
	
	init : function(){
		
		 this.createForm();
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '\
			<div id="exampleIdeviceForm">\
				<p>'+_("The user will see your name when clicking on the button.")+'</p>\
				<p style="margin-bottom:2em">'+_("The text of the button should be in the right language, that's why it's a required field.")+'</p>\
				<p><label for="fieldA">'+_("Write your name:")+' </label><input type="text" name="fieldA" id="fieldA" /></p>\
				<p><label for="fieldB">'+_("Button text:")+' </label><input type="text" name="fieldB" id="fieldB" /></p>\
			</div>\
		';
		
		// To add a file picker: '<input type="text" id="uploadFileExample" class="exe-file-picker" />'
		// To add an image picker: '<input type="text" id="uploadImageExample" class="exe-image-picker" />'
		// To add a TinyMCE editor: '<textarea id="tinyMCEexample" class="exe-html-editor"\></textarea>'
		// To add a color picker: '<input type="text" id="colorPickerExample" class="exe-color-picker" />'
		// To add dismissible instructions: <div class="exe-idevice-info">Instructions</div>
		// To add a FIELDSET (the link in the LEGEND is optional)
		/*
			<fieldset class="exe-fieldset exe-fieldset-closed">
				<legend><a href="#">Legend</a></legend>
				<div>
					...
				</div>
			</fieldset>		
		*/
		// Other options:
		/*
			<p class="exe-text-field">
				<label for="">Label: </label>
				<input type="text" id="" />
			</p>
			<p class='exe-text-field-inline'>
				<label for=''>Label:</label>
				<input type='text' id='' value='' />
			</p>	
		*/
		
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			
			// Button text
			var dt = $("dt",wrapper).text();
			
			// Your name
			var dd = $("dd",wrapper).text();
			
			// Load the previous values
			if (dt!="" && dd!="") {
				
				$("#fieldA").val(dd);
				$("#fieldB").val(dt);
				
			}
			
		}		
		
	},
	
	save : function(){
		
		var html = '<div class="exe-exampleIdevice">';
		
			// Get the content
			// Your name
			var yourName = $("#fieldA").val();
			if (yourName=="") {
				eXe.app.alert(_("You should write your name."));
				return false;
			}
			// Button text
			var buttonText = $("#fieldB").val();
			if (buttonText=="") {
				eXe.app.alert(_("You should write the button text."));
				return false;
			}
			
			// Remove HTML tags (just in case)
			var wrapper = $("<div></div>");
			// Your name
			wrapper.html(yourName);
			yourName = wrapper.text();
			// Button text
			wrapper.html(buttonText);
			buttonText = wrapper.text();			
			
			html += '<dl>';
				html += '<dt>'+buttonText+'</dt>';
				html += '<dd>'+yourName+'</dd>';
			html += '</dl>';
		
		html += '</div>';
		
		// Return the HTML to save
		return html;
		
	}

}