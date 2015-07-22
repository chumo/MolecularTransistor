	var Rvacancy = 2;
	var Radatom = 6;

	var numAdatoms = 0;
	var atomLocs = []; //array of indexes where adatoms are located

	//scales
	var xScale = d3.scale.linear()
	.range([PD, PD + LSurf])
	.domain([lim.xmin, lim.xmax]);

	var yScale = d3.scale.linear()
	.range([pd + LProf + pd + LSurf, pd + LProf + pd])
	.domain([lim.ymin, lim.ymax]);

	var yprofScale = d3.scale.linear()
	.range([pd + LProf, 2*pd])
	.domain([-1, 1]);

	//axis     
	var yprofAxis = d3.svg.axis()
	.scale(yprofScale)
	.orient("left")
	.ticks(5);

	var disp_yprofAxis = svgPmap.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + PD + ",0)")
	.call(yprofAxis);
/*
	var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom");

	var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");

	//add axis on groups
	var disp_xAxis = svgPmap.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + 0 + "," + (pd + LProf + pd + LSurf) + ")")
	.call(xAxis);

	var disp_yAxis = svgPmap.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + PD + "," + 0 + ")")
	.call(yAxis);

    //add text label for the axis
    svgPmap.append('text') //xAxis
    .attr('class','axisLabel')
    .attr('x',PD+LSurf/2)
    .attr('y',pd+LProf+pd+LSurf)
    .attr('dy',40)
    .text('X (Å)');

	svgPmap.append('text') //yAxis
	.attr('class','axisLabel')
	.attr('transform','rotate(-90)')
	.attr('y',PD)
	.attr('x',-(pd+LProf+pd+LSurf/2))
	.attr('dy',-40)
	.text('Y (Å)');
*/
	svgPmap.append('text') //yprofAxis
	.attr('class','axisLabel')
	.attr('transform','rotate(-90)')
	.attr('y',PD)
	.attr('x',-(pd+LProf/2))
	.attr('dy',-40)
	.text('Potential @ Y = 0');

	//title
	svgPmap.append('text')
		.attr('class','graphTitle')
		.attr('x',(PD+(LSurf)/2))
    	.attr('y',(pd+pd))
    	.attr('dy',-10)
    	.text('Potential profile along white horizontal');

    //horizontal profile
    Hprofile = svgPmap.append("path");

    //some functions
    
	function linspace(start, stop, nsteps){//Returns an array of values from start to stop in nsteps equally spaced intervals.
		var delta = (stop-start)/(nsteps-1);
		return d3.range(nsteps).map(function(i){return start+i*delta;});
	};

	function trapz(vecX,vecY){//integrates a curve using the trapezoidal method.
		var np = vecY.length;

		var sums = d3.range(np-1).map(function(i){return 0.5 * (vecY[i+1]+vecY[i]) * Math.abs(vecX[i+1]-vecX[i]);}); 
		return d3.sum(sums);
	};

	function Interpolator(vecX, vecY) {
		this.vecX = vecX;
		this.vecY = vecY;
		this.np = vecX.length;
		this.orde = orde;
	};  

	function orde(R) { //we assume that vecX is increasing monotonically.
		var pivot = (this.vecX.filter(function(x){return x <= R})).length-1;
		if (pivot == this.np-1) {
			return this.vecY[pivot];
		} else {
			return this.vecY[pivot] + (this.vecY[pivot+1] - this.vecY[pivot])*(R - this.vecX[pivot])/(this.vecX[pivot+1] - this.vecX[pivot]);
		};
	};  

	function Charged_Defect(charge,tsd,kappa,redmass,infinity) {
	  this.charge = charge; //idem (+1 in our case)
	  this.tsd = tsd; //tip sample distance (in Angstroms)
	  this.kappa = kappa; //average static dielectric constant (8.075 for InAs)
	  this.redmass = redmass; //reduced mass (0.043 in our case)
	  this.infinity = infinity; // a positive value. I try first with 1, then with 2, then with 3... until I don't see significant changes in the resulting potential. Actually, a value of 1 is already enough.

	  this.tsd_AU = this.tsd / 0.529177;
	  this.distance = linspace(0,300,50);

	  this.pot_function = pot_function;
	  this.potential = potential;

	  pot_array=[];
	  for (var i = 0; i < this.distance.length; i++) {
	  	pot_array.push(this.pot_function(this.distance[i]));
	  };
	  this.pot_array = pot_array;
	};

	function pot_function(R) {//Returns the electrostatic potential (in mV) as measured at a distance of R Angstroms.
        //Performs the full computation for every value of R.
        
        //var r = R.map(function(x){return x/0.529177;};
        	var r = R/0.529177;

        	var potk_x = linspace(0,this.infinity,10000);


        	var c = this.charge;
        	var k = this.kappa;
        	var t = this.tsd_AU;
        	var s = 2 * this.redmass/k;

        	var potk = d3.range(potk_x.length).map(function(i){
        		return (c/k)*(potk_x[i]/(potk_x[i]+s))*besselj(potk_x[i]*r,0)*Math.exp(-potk_x[i]*t);
        	});

        	var area = trapz(potk_x,potk);

        	return area*27.211384*1000;
        };

	function potential(R) {//Returns the electrostatic potential (in mV) as measured at a distance of R Angstroms.
        //The calculation is done by interpolating the values already computed and stored in self.pot_array.
        
        var f = new Interpolator(this.distance,this.pot_array);
        
        return f.orde(R);
    };

    function recreate_pmap(){
    	var charge = 1; 
    	var tsd = 5; 
    	var kappa = 8.075;
    	var redmass = 0.043;

		//create charge defect instance
		CD = new Charged_Defect(charge,tsd,kappa,redmass,2);

		//resets pmap to zeros
		Gen_pmap(); 

		//place a defect at every location
		/*	THIS FUNCTION IS INVOKED ONLY IN THE BEGINNING. THERE IS NO NEED TO PERTURB atomLocs ARRAY (it makes sense only in Gating_with_adatoms webapp)
		atomLocs = d3.range(circles[0].length).filter(function(i){return circles[0][i].attributes.class.value=='adatom';});
		
		for (var i = 0; i < atomLocs.length; i++) {
			var coord = {x:adsites[atomLocs[i]][0] , y:adsites[atomLocs[i]][1]};
			update_pmap(coord,true);
		};
		*/

		//build and display pmap image
		surfImage.attr('xlink:href','data:image/png;base64,' + arr2png(pmap));
	};

    ////////////////////////

    function arr2png(arr2D){ //returns a grayscale png string from a 2D array, using PNGlib.js
    	var rows = arr2D.length
    	var columns = arr2D[0].length
    	var p = new PNGlib(rows, columns, 256); // construcor takes height, weight and color-depth
		var background = p.color(0, 0, 0, 0); // set the background transparent

		var min = d3.min(arr2D.map(function(d){return d3.min(d)}));
		var max = d3.max(arr2D.map(function(d){return d3.max(d)}));

		var gray = d3.scale.linear().domain([min,max]).range([0,255]);

		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				grayvalue = gray(arr2D[i][j]);
				p.buffer[p.index(i, j)] = p.color(grayvalue,grayvalue,grayvalue);
			};
		};

		return p.getBase64()
	};

	function Gen_pmap(){
		pmap = Array(100); //matrix holding the potential values, created with 0 values
		for (var i = 0; i < 100; i++) {pmap[i]=Array(100)};
			for (var i = 0; i < 100; i++) {
				for (var j = 0; j < 100; j++) {
					pmap[i][j] = 0;
				};
			};

		//scales that depend on pmap
		x2i = d3.scale.linear()
		.rangeRound([0,pmap.length-1])
		.domain([lim.xmin, lim.xmax]);

		y2j = d3.scale.linear()
		.rangeRound([0,pmap[0].length-1])
		.domain([lim.ymax, lim.ymin]);

        //update profiles as well
        update_profiles();

    };

    function update_pmap(coord,adatom){
    	for (var i = 0; i < pmap.length; i++) {
    		for (var j = 0; j < pmap[0].length; j++) {
    			var dist = Math.sqrt(Math.pow(x2i.invert(i)-coord.x,2)+Math.pow(y2j.invert(j)-coord.y,2));
    			if (adatom) {
        			//pmap[i][j]+= gaussian(dist);
        			pmap[i][j]+= CD.potential(dist);
        		} else {
					//pmap[i][j]-= gaussian(dist);
					pmap[i][j]-= CD.potential(dist);
				};
			};
		};

        //if no adatoms, reset pmap to zero to avoid truncation error noise
        if (numAdatoms == 0) {Gen_pmap();};

        //update profiles as well
        update_profiles();
    };	

    function update_profiles(){
		//update profiles scales
		var Hpmap = d3.range(pmap[0].length).map(function(i){return pmap[i][y2j(0)];});

		//if no adatoms, scale the profile axes from -1 to 1 to have the profile line (which is all zero) in the middle
		if (numAdatoms == 0) {
			yprofScale.domain([-1,1]);
		} else {
			yprofScale.domain([d3.min(Hpmap),d3.max(Hpmap)]);
		};

		//update profiles tick labels
		disp_yprofAxis.transition().call(yprofAxis);

		var Hline = d3.svg.line()
		.interpolate('basis')
		.x(function(d) { return xScale(d[0]); })
		.y(function(d) { return yprofScale(d[1]); });

		Hprofile
		.datum(d3.range(pmap[0].length).map(function(i) { return [x2i.invert(i), Hpmap[i]]; }))
		.transition()
		.attr("class", "profile")
		.attr("d", Hline);

	};

	function gaussian(x){
		return 10*Math.exp(-Math.pow(x/20,2));
	};

	//generate pmap
	Gen_pmap();
	
    //surface potential image
    var surfImage = svgPmap.append('image')
    .attr('x',PD)
    .attr('y',pd + LProf + pd)
    .attr('width',LSurf)
    .attr('height',LSurf)
    .attr('id','surfImage')
    .attr('alt',"Surface Potential")
    .style('cursor','crosshair');

    surfImage.attr('xlink:href','data:image/png;base64,' + arr2png(pmap));

  	//horizontal line
  	svgPmap.append('line')
  		.attr('x1',xScale(lim.xmin))
  		.attr('x2',xScale(lim.xmax))
  		.attr('y1',yScale(0))
  		.attr('y2',yScale(0))
  		.style('stroke','silver')
  		.style('stroke-width','2');

    //meshgrid of adsorption sites
    function Gen_adsites(){
    	var a = 8.57; // Size of the first unit vector
		var b = 8.57; // Size of the second unit vector
		var alpha = 0; // Angle of the first unit vector in degrees
		var beta = 60; // Angle of the second unit vector in degrees
		alpha *= Math.PI / 180;
		beta *= Math.PI / 180;

		adsites=[];
    	for (var i = -100; i < 100 ; i++) { //i and j loop sufficiently large 
    		for (var j = -100; j < 100 ; j++) {
    			adsites.push([i * a * Math.cos(alpha) + j * b * Math.cos(beta), i * a * Math.sin(alpha) + j * b * Math.sin(beta)]);
    		};
    	};
    	var rpad = 0//(Radatom+1)/2
    	adsites = adsites.filter(function(d){return d[0] > lim.xmin+rpad && d[0] < lim.xmax-rpad && d[1] > lim.ymin+rpad && d[1] < lim.ymax-rpad});
    };

	//add circles at adsorption sites	
	function update_adsites(reset){
		
		if (reset) { //the adatoms from the map should be eliminated (for example, when the lattice is updated)
			numAdatoms = 0;
			atomLocs = [];
			Gen_pmap(); //resets pmap to zeros
			surfImage.attr('xlink:href','data:image/png;base64,' + arr2png(pmap));
		};

		Gen_adsites(); //generate adsites data set
		
		//join data
		circles = svgPmap.selectAll('circle').data(adsites);

		//update
		circles
			.attr('class',function(d,i){
				return (atomLocs.indexOf(i) > -1 ) ? 'adatom' : 'vacancy';})
			.attr('r',function(d,i){
				return (atomLocs.indexOf(i) > -1 ) ? Radatom : Rvacancy;})
			.transition()
			.attr('cx',function(d){return xScale(d[0])})
			.attr('cy',function(d){return yScale(d[1])});

    	//enter
    	circles
    	.enter()
    	.append('circle')
    		.attr('class',function(d,i){
    			return (atomLocs.indexOf(i) > -1 ) ? 'adatom' : 'vacancy';})
    		.attr('r',function(d,i){
    			return (atomLocs.indexOf(i) > -1 ) ? Radatom : Rvacancy;})
    		.transition()
    		.attr('cx',function(d){return xScale(d[0])})
    		.attr('cy',function(d){return yScale(d[1])});

    	//exit
    	circles
    	.exit()
    	.remove();

    	//DEPOSIT OR REMOVE AN ATOM. Update potential image when the set of adatoms is modified
    	circles.on('click',function(){
    		var mycircle = d3.select(this);
    		var cls = mycircle.attr('class');
    		var x = xScale.invert(mycircle.attr('cx'));
    		var y = yScale.invert(mycircle.attr('cy'));

    		var coord = {x:x, y:y};

  			//animate the tip
  			tip.transition().attr('transform','translate('+mycircle.attr('cx')+','+(surfaceYpx-tsdDown)+')scale('+depth(y)+')')
  				.transition().attr('transform','translate('+mycircle.attr('cx')+','+(surfaceYpx-tsdUp)+')scale('+depth(y)+')');

			//compute the index of adsites corresponding to the deposited or removed adatom.
			//and push it or pull it from atomLocs array.
  			//This is necessary to sort the array of adatom locations and avoid weird effects on transitions in renderAdatoms()
	  			var distSqr = adsites.map(function(d){
	  					return Math.pow(d[0]-x,2) + Math.pow(d[1]-y,2);
	  				});
	  			var adatomIndex = distSqr.indexOf(d3.min(distSqr));

    		if (cls == 'adatom') {
    			numAdatoms -= 1;
    			
    			//put the clicked adatom index at the end of atomLocs and bind again the data to circles to have later a good transition behaviour on exit()
    				//atomLocs = atomLocs.sort(function(a,b){return a-b-adatomIndex;});
    				atomLocs = atomLocs.map(function(d){return d-adatomIndex;}).sort(function(a,b){return -Math.abs(a)+Math.abs(b);}).map(function(d){return d+adatomIndex;});
    				renderAdatoms();

    			mycircle.attr('r',Rvacancy).attr('class','vacancy');
    			atomLocs.pop();
    			
    			update_pmap(coord,false);
    		} else {
    			numAdatoms += 1;
    			
    			mycircle.attr('r',Radatom).attr('class','adatom');
    			atomLocs.push(adatomIndex);
    			
    			update_pmap(coord,true);
    		};

    		surfImage.attr('xlink:href','data:image/png;base64,' + arr2png(pmap));

    		//gate the molecular levels
    		gateAtMol = pmap[x2i(posMol[0])][y2j(posMol[1])];
  			gate_ELevels(gateAtMol);

  			//render adatoms in scene
  			renderAdatoms();

    	});

    };

	//update adsites positions with the adsites dataset default values
	update_adsites(true);

	//create pmap
	recreate_pmap()

    //add potential text
    potText = svgPmap
    .append('text')
    .attr('id','potText')
    .style('font-family','Helvetica')
    .style('font-size','20px')
    .style('fill','white')
    .attr('x', (PD+5))
    .attr('y', (2*pd+LProf+20))
    .text('Potential: - mV');

    //scale bar
    svgPmap
    .append('line')
    .style('stroke-width','6px')
    .style('stroke','white')
    .attr('x1', xScale(55.5))
    .attr('x2', xScale(75.5))
    .attr('y1', yScale(70))
    .attr('y2', yScale(70));

 	svgPmap.append('text')
    .style('font-family','Helvetica')
    .style('font-size','20px')
    .style('fill','white')
    .attr('x', xScale(58))
    .attr('y', yScale(73))
    .text('2 nm');

    //subpanel title
    svgPmap.append('text')
	.attr('class','graphTitle')
	.attr('transform','rotate(-90)')
	.attr('y',PD)
	.attr('x',-(pd+LProf+pd+LSurf/2))
	.attr('dy',-15)
	.style('fill','#828282')
	.text('TOP view');

	//Pc molecule
	var molRotation = false;
	var manip = false;
	var posMol=[0,0];//to keep track of where the molecule is
	var topPc = svgPmap
			.append('g')
			.attr('id','topPc');

	var top0 = topPc.append('image')
    	.attr('alt','Pc molecule')
    	.attr('x','-30')
    	.attr('y','-30')
    	.attr('width',60)
    	.attr('height',60)
    	.attr('xlink:href','images/top0.png');

    var top1 = topPc.append('image')
    	.attr('alt','Pc molecule')
    	.attr('x','-30')
    	.attr('y','-30')
    	.attr('width',60)
    	.attr('height',60)
    	.attr('xlink:href','images/top1.png');

    var top2 = topPc.append('image')
    	.attr('alt','Pc molecule')
    	.attr('x','-30')
    	.attr('y','-30')
    	.attr('width',60)
    	.attr('height',60)
    	.attr('xlink:href','images/top2.png');

    //at start, only the first frame is visible
    top1.style('display','none');
    top2.style('display','none');

    topPc.attr('transform','translate('+xScale(0)+','+yScale(0)+')');

	var dragMolecule = d3.behavior.drag()
    	//.on('dragstart',function(){
    	//		molRotation = true;
    	//	})
    	.on('drag', function() {// translate to the closest adsorption site
    			molRotation = true;
    			manip = true;
  				
  				var x = d3.event.x;
  				var y = d3.event.y;

  				var distSqr = adsites.map(function(d){
  					return Math.pow(xScale(d[0])-x,2) + Math.pow(yScale(d[1])-y,2);
  				});

  				var minInd = distSqr.indexOf(d3.min(distSqr));

  				posMol = [adsites[minInd][0],adsites[minInd][1]];

				sidePc.data([posMol]); //this is necessary for rendering the 3d scene later on
  				topPc.attr('transform','translate('+xScale(posMol[0])+','+yScale(posMol[1])+')');
  				sidePc.attr('transform','translate('+xScale(posMol[0])+','+(surfaceYpx-smd*depth(posMol[1]))+')scale('+depth(posMol[1])+')');

  				//sort by Y coordinate the group of adatoms plus the molecule, to provide a proper depth render
        		svgScene.selectAll('.adatom, #sidePc').sort(function(a,b){return a[1]-b[1]});

  				//gate the molecular levels
  				gateAtMol = pmap[x2i(posMol[0])][y2j(posMol[1])];
  				gate_ELevels(gateAtMol);
  				
			})
    	.on('dragend',function(){
    			molRotation = false;
    			manip = false;
    			tip.transition().attr('transform','translate('+xScale(posMol[0])+','+(surfaceYpx-tsdUp)+')scale('+depth(posMol[1])+')');
    		});

	topPc.style("cursor", "pointer").call(dragMolecule);

	d3.timer(function(t){
		if (molRotation) { //rotate every 1/frequency ms
			var frequency = freqFactor(Math.abs(bias))/(16);// from 1/256 Hz to 1/48 Hz
			top0.style('display',(Math.trunc(t * frequency) % 3) == 0 ? '' : 'none');
			top1.style('display',(Math.trunc(t * frequency) % 3) == 1 ? '' : 'none');
			top2.style('display',(Math.trunc(t * frequency) % 3) == 2 ? '' : 'none');

			side0.style('display',(Math.trunc(t * frequency) % 3) == 0 ? '' : 'none');
			side1.style('display',(Math.trunc(t * frequency) % 3) == 1 ? '' : 'none');
			side2.style('display',(Math.trunc(t * frequency) % 3) == 2 ? '' : 'none');
		};
	});

    //mouse event to display potential value and move the STM tip
    svgPmap.on('mousemove',function(){
    	var mx= d3.mouse(this)[0];
    	var my= d3.mouse(this)[1];

    	var potText = d3.select('#potText');
    	text = 'Potential: - mV';

        //surface area
        if (mx > PD && mx < (PD+LSurf) && my > (pd+LProf+pd) && my < (pd+LProf+pd+LSurf)) {
        	var i = x2i(xScale.invert(mx));
        	var j = y2j(yScale.invert(my));
        	text = 'Potential: '+pmap[i][j].toFixed(1)+' mV';

        	tip.attr('transform','translate('+mx+','+(surfaceYpx-tsdUp+manipDistance*manip)+')scale('+depth(yScale.invert(my))+')');
        	zeroBias(); //when the mouse is in, the bias should be zero, because the tip might not be on the molecule.
        } else { //leave the tip on the molecule if the mouse is not in the surface area
			tip.transition().attr('transform','translate('+xScale(posMol[0])+','+(surfaceYpx-tsdUp)+')scale('+depth(posMol[1])+')');
        };

        //horizontal profile area
        if (mx > PD && mx < (PD+LSurf) && my > pd && my < (pd+LProf)) {
        	var i = x2i(xScale.invert(mx));
        	text= 'Potential: '+pmap[i][y2j(0)].toFixed(1)+' mV';
        };

        potText.text(text)	

    });

	svgPmap.on('mouseleave',function(){//leave the tip on the molecule also if the mouse leaves this svg
		tip.transition().attr('transform','translate('+xScale(posMol[0])+','+(surfaceYpx-tsdUp)+')scale('+depth(posMol[1])+')');
	});

	//Show potential profile or 3D scene
	function showButton(){
		if ($("#divShowButton").text() == 'show PROFILE') {
			$("#divScene").slideUp(500);
			$("#divShowButton").text('show 3D SCENE');
		} else {
			$("#divScene").slideDown(500);
			$("#divShowButton").text('show PROFILE');
		};
	};


