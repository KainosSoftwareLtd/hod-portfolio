// Used in tables to collapse child rows
$('[data-collapsable-parent]').click(function(){
	var child = $(this).attr("data-collapsable-parent");
	$('[data-collapsable-child="' + child + '"]').toggle('fast');
});
