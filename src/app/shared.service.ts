import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
	    private rootScope:any[];

	    constructor() {
	      this.rootScope = [];
	    }

	    setValue(name , val) {
	    	 this.rootScope = this.rootScope ? this.rootScope : [];
             this.rootScope[name] = val;
	    }

	    getValue(name) {
		    if(this.rootScope){
		        return ("undefined" !== typeof this.rootScope[name]) ? this.rootScope[name] : '' ;
		    }
	    }


	  serializeData(data) {

	    var buffer = [];

	    for (var name in data) {

	        if (!data.hasOwnProperty(name)) {

	            continue;

	        }

	        var value = data[name];

	        buffer.push(
	        encodeURIComponent(name) +
	        "=" +
	        encodeURIComponent((value == null) ? "" : value)
	        );

	    }

	    var source = buffer
	    .join("&")
	    .replace(/%20/g, "+")
	    ;

	    return (source);

	}
	    
}
