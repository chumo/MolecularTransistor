	var gateAtMol = 0;
	var bias = 0;

	//scales
	var Emin = -1500;
	var Emax = 1500;

	var yEnScale = d3.scale.linear()
		.range([h-hDiamond, pd+PD])
		.domain([Emin, Emax]);

	var xEnScale = d3.scale.linear()
		.range([0, w-wPmap])
		.domain([0, 100]);//from 0 to 100 to define a percentage scale

    //wells and bands
    	var wellH = 1000;//well height in mV
      //percentage of horizontal dimension of the width of different elements
    	var lMargin = xEnScale.invert(PD);
		var bandW = 21.5;
		var gapW = 18;
		var wellW = 10; //average well width
			var wellSurf = wellW*2*levFactor; //well width between surface and molecule
			var wellTip = wellW*2*(1-levFactor); //well width between tip and molecule
			
	  //path generator
	    var LineInEnergies = d3.svg.line()
    		.x(function(d){return xEnScale(d[0]);})
    		.y(function(d){return yEnScale(d[1]);});
      //bands ********************* REWRITE THIS USING SVG RECT ELEMENTS
	    var band_1 = svgEnergies.append('path').attr('class','band');
    	var band_2 = svgEnergies.append('path').attr('class','band');
		band_1
   			.datum([
   				[lMargin,Emin],
   				[lMargin,0],
   				[lMargin+bandW,0],
   				[lMargin+bandW,Emin],
   				[lMargin,Emin]])
    		.attr('d',LineInEnergies)
    		.style('fill','url(#bandGradient)');
    	band_2
   			.datum([
   				[lMargin+bandW+2*wellW+gapW,Emin],
   				[lMargin+bandW+2*wellW+gapW,0],
   				[lMargin+2*bandW+2*wellW+gapW,0],
   				[lMargin+2*bandW+2*wellW+gapW,Emin],
   				[lMargin+bandW+2*wellW+gapW,Emin]])
    		.attr('d',LineInEnergies)
    		.style('fill','url(#bandGradient)');
      //wells
    	var well_1 = svgEnergies.append('path').attr('class','well');
    	var well_2 = svgEnergies.append('path').attr('class','well');
		well_1
   			.datum([
   				[lMargin+bandW,Emin],
   				[lMargin+bandW,wellH],
   				[lMargin+bandW+wellTip,wellH],
   				[lMargin+bandW+wellTip,Emin]])
    		.attr('d',LineInEnergies);
    	well_2
   			.datum([
   				[lMargin+bandW+wellTip+gapW,Emin],
   				[lMargin+bandW+wellTip+gapW,wellH],
   				[lMargin+bandW+2*wellW+gapW,wellH],
   				[lMargin+bandW+2*wellW+gapW,Emin]])
    		.attr('d',LineInEnergies);
      //Fermi levels
      	var FLevel_1 = svgEnergies.append('line')
      			.attr('class','FLevel')
      			.attr('x1',xEnScale(lMargin))
      			.attr('y1',yEnScale(0))
				.attr('x2',xEnScale(lMargin+bandW))
      			.attr('y2',yEnScale(0));

      	var FLevel_2 = svgEnergies.append('line')
      			.attr('class','FLevel')
      			.attr('x1',xEnScale(lMargin+bandW+2*wellW+gapW))
      			.attr('y1',yEnScale(0))
				.attr('x2',xEnScale(lMargin+2*bandW+2*wellW+gapW))
      			.attr('y2',yEnScale(0));

      	var dragBias = d3.behavior.drag()
    		.on('drag', applyBias);

    	function applyBias() {// apply a bias voltage
  				
  				var elementID = d3.select(this).attr('id');

  				if (elementID == 'FLevel_1') {
  					bias = yEnScale.invert(d3.event.y);
  				} else if (elementID == 'biasTriangle') {
  					bias = yDmScale.invert(d3.event.y);
  				};

  				//don't allow to drag the bias beyond the y axis limits of svgDiamonds
  				if (bias>limDm.ymax){
  					bias = limDm.ymax;
  					return;
  				} else if (bias<limDm.ymin) {
  					bias = limDm.ymin;
  					return;
  				};

  				FLevel_1
  					.attr('y1',yEnScale(bias))
					.attr('y2',yEnScale(bias));

				band_1
   					.datum([
   						[lMargin, Emin],
   						[lMargin, bias],
   						[lMargin+bandW, bias],
   						[lMargin+bandW, Emin],
   						[lMargin, Emin]])
    				.attr('d',LineInEnergies);

    			well_1
   					.datum([
   						[lMargin+bandW,Emin],
   						[lMargin+bandW, E_from_lateralPercentage(lMargin+bandW,bias)],
   						[lMargin+bandW+wellTip, E_from_lateralPercentage(lMargin+bandW+wellTip,bias)],
   						[lMargin+bandW+wellTip, Emin]])
    				.attr('d',LineInEnergies);
  				
  				well_2
   					.datum([
   						[lMargin+bandW+wellTip+gapW,Emin],
   						[lMargin+bandW+wellTip+gapW,E_from_lateralPercentage(lMargin+bandW+wellTip+gapW,bias)],
   						[lMargin+bandW+2*wellW+gapW,E_from_lateralPercentage(lMargin+bandW+2*wellW+gapW,bias)],
   						[lMargin+bandW+2*wellW+gapW,Emin]])
    				.attr('d',LineInEnergies);

    			biasTriangle
    				.attr('transform','translate(0,'+(yDmScale(bias)-yDmScale(0))+')'); 

    			bias_ELevels(bias);
			};

		var zeroBias = function(){
				sceneElectron.attr('r',0);

				bias = 0;

				FLevel_1
					.transition().ease('linear')
  					.attr('y1',yEnScale(0))
					.attr('y2',yEnScale(0));

				band_1
   					.datum([
   						[lMargin, Emin],
   						[lMargin, 0],
   						[lMargin+bandW, 0],
   						[lMargin+bandW, Emin],
   						[lMargin, Emin]])
   					.transition().ease('linear')
    				.attr('d',LineInEnergies);

    			well_1
   					.datum([
   						[lMargin+bandW,Emin],
   						[lMargin+bandW, E_from_lateralPercentage(lMargin+bandW,0)],
   						[lMargin+bandW+wellTip, E_from_lateralPercentage(lMargin+bandW+wellTip,0)],
   						[lMargin+bandW+wellTip, Emin]])
   					.transition().ease('linear')
    				.attr('d',LineInEnergies);
  				
  				well_2
   					.datum([
   						[lMargin+bandW+wellTip+gapW,Emin],
   						[lMargin+bandW+wellTip+gapW,E_from_lateralPercentage(lMargin+bandW+wellTip+gapW,0)],
   						[lMargin+bandW+2*wellW+gapW,E_from_lateralPercentage(lMargin+bandW+2*wellW+gapW,0)],
   						[lMargin+bandW+2*wellW+gapW,Emin]])
   					.transition().ease('linear')
    				.attr('d',LineInEnergies);

    			biasTriangle
    				.transition().ease('linear')
    				.attr('transform','translate(0,'+(yDmScale(0)-yDmScale(0))+')'); 

    			bias_ELevels(0);
		};

    	function E_from_lateralPercentage(x,bias){ //Energy value (vertical axis) from lateral position in percentage assuming a linear trend accross the tunneling gap
    		//return wellH-(bias)*(x-(lMargin+bandW+2*wellW+gapW))/(2*wellW+gapW);
    		if (x > lMargin+bandW+wellTip) {x -= gapW};
			return wellH-(bias)*(x-(lMargin+bandW+2*wellW))/(2*wellW);
    	};

		FLevel_1.attr('id','FLevel_1').style('cursor', 'ns-resize').call(dragBias);

	//molecular levels
	var minIncEne = limDm.ymax*.75;//the minimum separation between levels should be limDm.ymax
								//to avoid overlaping diamonds in the stability diagram, 
								//that is, two levels at a time in between the two Fermi levels

	var ML = [-minIncEne+200,200,minIncEne+200,2*minIncEne+200];
		
	var actualEnergies = ML.map(function(d){return d + bias*levFactor - gateAtMol;});
	var transientLevel = actualEnergies.filter(function(d){return ((bias<d && d<0) || (bias>d && d>0));})[0];

	var ELevels_gBias = svgEnergies.append('g').attr('id','ELevels_gBias'); //Group holding the translations due to bias
	var ELevels_gGate = ELevels_gBias.append('g').attr('id','ELevels_gGate'); //Group holding the translations due to gate

	var ELevels = ELevels_gGate.selectAll('.ELevel')
					.data(ML)
					.enter()
					.append('line')
					.attr('class','ELevel')	
      				.attr('x1',xEnScale(lMargin+bandW+wellTip))
      				.attr('y1',function(d){return yEnScale(d);})
					.attr('x2',xEnScale(lMargin+bandW+wellTip+gapW))
      				.attr('y2',function(d){return yEnScale(d);});

	function gate_ELevels(gate){
		ELevels_gGate.transition().attr('transform','translate(0,'+(yEnScale(0)-yEnScale(gate))+')'); 
		biasBar.transition().attr('transform','translate('+(xDmScale(gate)-xDmScale(0))+',0)');
		update_occupancies();
	};

	function bias_ELevels(bias){
		//var shiftAt0Bias = E_from_lateralPercentage(lMargin+bandW+wellW+gapW/2,0);
		//var shiftFromBias = E_from_lateralPercentage(lMargin+bandW+wellW+gapW/2,bias);
		//var shiftAt0Bias = E_from_lateralPercentage(lMargin+bandW+wellW*(2*(levFactor)),0);
		//var shiftFromBias = E_from_lateralPercentage(lMargin+bandW+wellW*(2*(levFactor)),bias);
		var shiftAt0Bias = levFactor*0;
		var shiftFromBias = levFactor*bias;
		ELevels_gBias.transition().ease('linear').attr('transform','translate(0,'+(yEnScale(shiftFromBias)-yEnScale(shiftAt0Bias))+')'); 
		update_occupancies();
	};

	function update_occupancies(){
		occElectron.transition().attr('r',function(d){
							var actualEnergy = d + bias*levFactor - gateAtMol;
							return (actualEnergy<=Math.min(0,bias)) ? '10' : '0';
						});
		//update also the array of actual Energy levels and the value of transientLevel (if any)
		actualEnergies = ML.map(function(d){return d + bias*levFactor - gateAtMol;});
		transientLevel = actualEnergies.filter(function(d){return ((bias<d && d<0) || (bias>d && d>0));})[0];
	};

	//mask molecular levels at the top
	svgEnergies.append('rect')
        .attr('id','maskMolLevels')
        .attr('x',xEnScale(lMargin+bandW+wellTip))
        .attr('y',0)
        .attr('width',xEnScale(gapW))
        .attr('height',h-hDiamond)
        .style('fill','url(#maskMolLevelsGradient)');


	// animated current, both in divEnergies and divScene
	var occElectron = ELevels_gGate.selectAll('circle')
						.data(ML)
						.enter()
						.append('circle')
						.attr('class','electron')
						.attr('cx',xEnScale(lMargin+bandW+wellTip+gapW/2))
						.attr('cy',function(d){return yEnScale(d);})
						.attr('r',function(d){
							var actualEnergy = d + bias*levFactor - gateAtMol;
							return (actualEnergy<=Math.min(0,bias)) ? '10' : '0';
						});

	var transportElectron = svgEnergies
						.append('circle')
						.attr('class','electron')
						.attr('cx',xEnScale(lMargin))
						.attr('cy',yEnScale(0))
						.attr('r','10');

	function electronEnergy(x){
		if (x >= lMargin+bandW+2*wellW+gapW) { //Fermi level of the sample
			return 0;
		} else if (x > lMargin+bandW && x < lMargin+bandW+2*wellW+gapW) { //transient level
			return transientLevel;
		} else { //Fermi level of the tip
			return bias;
		};
	};

	var freqFactor = d3.scale.linear()
			.range([1/16,1/4]) //from low to high frequency
			.domain([0,Math.max(Math.abs(limDm.ymin),Math.abs(limDm.ymax))]);

	d3.timer(function(t){
		var electronX;

		if (bias > 0) {
			electronX = lMargin + t*freqFactor(Math.abs(bias)) % (2*bandW+2*wellW+gapW);
		} else {
			electronX = lMargin+2*bandW+2*wellW+gapW - t*freqFactor(Math.abs(bias)) % (2*bandW+2*wellW+gapW);
		};

		var electronY = electronEnergy(electronX);

		//transform to pixels
		electronX = xEnScale(electronX);
		electronY = yEnScale(electronY);

		if (transientLevel != undefined) { //there is at least one transientLevel (level between the two Fermi levels)
			molRotation = true;
			transportElectron.attr('cx',electronX).attr('cy',electronY);

			//animate sceneElectron accordingly
			var a = elecZ(xEnScale(lMargin));//surfaceYpx;
			var b = elecZ(xEnScale(lMargin+2*bandW+2*wellW+gapW));//surfaceYpx-tsdUp;
			sceneElectron.attr('cx',xScale(posMol[0]))
                        .attr('cy',elecZ(electronX))
                        .attr('r',10*Math.pow(Math.sin(Math.PI*(elecZ(electronX)-a)/(b-a)),2))
                        .style('opacity',0.7*Math.pow(Math.sin(Math.PI*(elecZ(electronX)-a)/(b-a)),2));

		} else {
			molRotation = false;
			sceneElectron.attr('r',0);
			if (bias < 0) {
				transportElectron
					.attr('cx',xEnScale(lMargin+2*bandW+2*wellW+gapW))
					.attr('cy',yEnScale(0));
			} else {
				transportElectron
					.attr('cx',xEnScale(lMargin))
					.attr('cy',yEnScale(bias));
			};
		};

	});

	//energy axis
	var yDiagramScale = d3.scale.linear()
		.range([yEnScale(limDm.ymin), yEnScale(2*limDm.ymax)])
		.domain([limDm.ymin, 2*limDm.ymax]);

	var yEnAxis = d3.svg.axis()
		.scale(yDiagramScale)
		.orient("left");
	var disp_yEnAxis = svgEnergies.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + PD + ",0)")
		.call(yEnAxis);
	svgEnergies.append('text') //yAxis
		.attr('class','axisLabel')
		.attr('transform','rotate(-90)')
		.attr('y',PD)
		.attr('x',-(pd+pd+(hDiamond-PD-pd)/2))
		.attr('dy',-45)
		.text('Energy (meV)');

	//title
	svgEnergies.append('text')
		.attr('class','graphTitle')
		.attr('x',(PD+(w-wPmap-pd-PD)/2))
    	.attr('y',(pd+pd))
    	.attr('dy',-10)
    	.text('Energy diagram');

    //labels
    	//tip
		svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-2em')
	    	.text('TIP');
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-1em')
	    	.text('electronic band');
	    //surface	
		svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+2*wellW+gapW+bandW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-2em')
	    	.text('SURFACE');
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+2*wellW+gapW+bandW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-1em')
	    	.text('electronic band');
	    //molecule
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellTip+gapW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-2em')
	    	.text('MOLECULAR');
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellTip+gapW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-1em')
	    	.text('levels');
	    //vacuum barriers
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellTip/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-2em')
	    	.text('vacuum');
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellTip/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-1em')
	    	.text('barrier');
	   /* svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellW+gapW+wellW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-2em')
	    	.text('vac.');
	    svgEnergies.append('text')
			.attr("class", "axisLabel")
			.attr('x',xEnScale(lMargin+bandW+wellW+gapW+wellW/2))
	    	.attr('y',(h-hDiamond))
	    	.attr('dy','-1em')
	    	.text('barrier');
		*/
