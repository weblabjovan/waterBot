module.exports = (text) => {
	switch (text) {
	    case "3 Times a Day":
		    return {
		 		reminder: true,
		 		rate: 3
		    }
		case "Twice a Day": 
		    return {
		 		reminder: true,
		 		rate: 2
		    }
		case 'Once a Day':
		    return {
		 		reminder: true,
		 		rate: 1
		    }
		case 'Stop reminding me':
		    return {
		 		reminder: false,
		 		rate: 0
		    }
	     
	    default:
	      return null;
     }
}