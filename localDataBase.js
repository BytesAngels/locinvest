function initDatabase() {
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } else {
	        var shortName = 'LOCINVEST';1
	        var version = '1.0';
	        var displayName = 'LOCINVEST Data Base';
	        var maxSize = 100000; // in bytes
	        LOCINVESTDB = openDatabase(shortName, version, displayName, maxSize);
			createTables();
	    }
	} catch(e) {
	    if (e == 2) {
	        // Version mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+ e +".");
	    }
	    return;
	} 
}

function createTables(){
	LOCINVESTDB.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS simulations(id TEXT NOT NULL PRIMARY KEY, nom TEXT, prixAcquisition TEXT, loyerMensuel TEXT, taxeFonciere TEXT, fraisGestion TEXT);', [], nullDataHandler, errorHandler);
        }
    );
}

function saveNew(params){
	console.log(params);
    LOCINVESTDB.transaction(
        function (transaction) {
        transaction.executeSql("INSERT INTO simulations(id, nom, prixAcquisition, loyerMensuel, taxeFonciere, fraisGestion ) VALUES (?, ?, ?, ?, ?, ?)", [params.id, params.nom, params.prixAcquisition, params.loyerMensuel, params.taxeFonciere, params.fraisGestion]);  
        }
    );
}

function update(params){
	console.log(params);
    LOCINVESTDB.transaction(
        function (transaction) {
        transaction.executeSql("UPDATE simulations SET nom='"	+ params.nom +
							   "', prixAcquisition='"			+ params.prixAcquisition +
							   "', loyerMensuel='"				+ params.loyerMensuel +
							   "', taxeFonciere='"				+ params.taxeFonciere +
							   "', fraisGestion='" 				+ params.fraisGestion +
							   "' WHERE id = '" 				+ params.id +
							   "';",
							   [],
							   nullDataHandler,
							   errorHandler);
        }
    );
}

function selectAll(){ 
	LOCINVESTDB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM simulations;", [], dataSelectHandler, errorHandler);	        
	    }
	);
}

function suppr(id) {
	LOCINVESTDB.transaction(
	    function (transaction) {
	        transaction.executeSql("DELETE FROM simulations WHERE id='" + id + "';", [], dataSelectHandler, errorHandler);	        
	    }
	);
}

function dataSelectHandler(transaction, results){
	RafraichirList(results);
}

function nullDataHandler(){
	console.log("SQL Query Succeeded");
}

function errorHandler(transaction, error)
{
 	if (error.code==1){
 		console.log("DB Table already exists");
    }
	else {
		console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
	return false;
}