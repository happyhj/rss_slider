// 도구 마련	
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
if (!String.prototype.urlEncode) {
    String.prototype.urlEncode = function () {
        var unencoded = this;
        return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
    };
}
if (!String.prototype.urlDecode) {
    String.prototype.urlDecode = function () {
        var encoded = this;
        return decodeURIComponent(encoded.replace(/\+/g,  " "));
    };
} 
    
var $ = {
	getTemplateCompiler: function(templateStr) {
	    return function(dataObj) {
	        var resultStr = templateStr.trim();
	        for (var variableName in dataObj)
	        {
	            //var replaceIndex = resultStr.indexOf("<%=");
	            //var replaceEndIndex = resultStr.indexOf("%>", replaceIndex);
				//console.log(variableName);
				//console.log(dataObj[variableName]);

//	            var variableName = resultStr.substring(replaceIndex + 3, replaceEndIndex).trim();
	            if (variableName===0||dataObj[variableName]) {
	                resultStr = resultStr.replace("<%= "+variableName+" %>", dataObj[variableName]);
	            }
	        }
	        return resultStr;
	    };
	} 	
};
var serializeObject = function(obj) {
    var pairs = [];
    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
            continue;
        }
        pairs.push(prop + '=' + obj[prop].urlEncode());
    }
    return pairs.join('&');
}
function replaceAll(strTemp, strValue1, strValue2){ 
        while(1){
            if( strTemp.indexOf(strValue1) != -1 )
                strTemp = strTemp.replace(strValue1, strValue2);
            else
                break;
        }
        return strTemp;
}