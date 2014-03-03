var tableBody = {};
var rowList = [];

function addRow( row ) {
    var checkbox = $('<td><input type="checkbox"/></td>');
    var name = $('<td>' + row.name + '</td>');
    var email = $('<td>' + row.email + '</td>');
    var phone = $('<td>' + row.phone + '</td>');
    var groups = $('<td>' + row.groups + '</td>');

    var newRow = $('<tr>');
    newRow.append(checkbox, name, email, phone, groups);

    tableBody.append(newRow);
}

function showRows (filter) {
    if (!filter) filter = '';
    tableBody.empty();
    function filterFunc(row) {
        return row.name.indexOf(filter) > -1;
    }
    var filteredRowList = rowList.filter(filterFunc);
    filteredRowList.forEach(function(row) {
        addRow(row);
    });
}

$(
    function () {
        tableBody = $("#table-content");

        var Customers = { };
        var Groups = { };

        $.when(
            $.getJSON("json/customers.json", function(jsonCustomers) {
                Customers = jsonCustomers;
            }),
            $.getJSON("json/customers-groups.json", function(jsonGroups) {
                Groups = jsonGroups;
            })
        ).then(
                function() {
                    function processCustomer ( c ){
                        var resultRow = { };
                        resultRow.name = '';
                        resultRow.email = '';
                        resultRow.phone = '';
                        resultRow.groups = '';

                        if (c.firstname)
                            resultRow.name += c.firstname;
                        if (c.middlename)
                            resultRow.name += ' ' + c.middlename;
                        if (c.lastname)
                            resultRow.name += ' ' + c.lastname;

                        if (c.phone)
                            resultRow.phone = c.phone;

                        if (c.email)
                            resultRow.email = c.email;

                        var userGroups = Groups.filter( function ( g ){
                            return $.inArray(+g.id + '', c.groups) > -1
                        });

                        userGroups.forEach (function ( g ) {
                            resultRow.groups += g.title + ', ';
                        });

                        if (resultRow.groups.length > 1)
                            resultRow.groups = resultRow.groups.substring(0,resultRow.groups.length - 2);

                        rowList.push(resultRow);
                        showRows();
                    }
                    Customers.forEach(processCustomer);
                }
            );

        $('#find').on( "input" ,
            function () {
                showRows($(this).val());
        });
    }
)