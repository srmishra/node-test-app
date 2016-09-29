/**
 * This is a manifest file that will be compiled into application.js, which will
 * include all the files listed below.
 *
 * Any JavaScript file within this directory can be referenced here using a
 * relative path.
 *
 * It's not advisable to add code directly here, but if you do, it will appear
 * at the bottom of the compiled file.
 *
 */

//= require sha
//= require main
//= require memo
//= require sort
//= require search
//= require style
//= require accData

$(document).ready(function(){
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
});