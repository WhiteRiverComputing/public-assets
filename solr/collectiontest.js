// JavaScript to retrieve Collections data from Solr
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "title",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "description",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "key",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "timestamp",
            dataType: tableau.dataTypeEnum.datetime,
        }];

        var tableSchema = {
            id: "Collections_Test",
            alias: "Data Commons Collections Test",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var url;
        url = "http://lci-dev.whiterivercomputing.com/wdc/solr/collections.json";
        $.getJSON(url, function(resp) {
            var docs = resp.response.docs,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = docs.length; i < len; i++) {
                tableData.push({
                    "id": docs[i].id,
                    "title": docs[i].archive__collection__title,
                    "description": docs[i].archive__collection__description,
                    "key": docs[i].archive__collection__key,
                    "timestamp": docs[i].timestamp,
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Data Commons Test Collections"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
