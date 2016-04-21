(function (global) {
var ajaxUtils = {};


function getRequestObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (window.ActiveXObject) {
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
}


ajaxUtils.sendGetRequest = function(requestUrl, responseHandler) {
    var request = getRequestObject();
    request.onreadystatechange = function() { 
        handleResponse(request, responseHandler); 
    };
    request.open("GET", requestUrl, true);
    request.send(null);
    
};

ajaxUtils.sendPostRequest = function(requestUrl, responseHandler, body) {
    var request = getRequestObject();
    request.onreadystatechange = function() { 
        handleResponse(request, responseHandler); 
    };
    request.open("POST", requestUrl, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send(body);
    
};


function handleResponse(request, responseHandler) {
  if ((request.readyState == 4) && (request.status == 200)) {
    responseHandler(request.responseText);
  }
}

global.$ajaxUtils = ajaxUtils;


})(window);
