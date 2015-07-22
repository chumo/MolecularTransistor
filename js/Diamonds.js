	//scales
	var xDmScale = d3.scale.linear()
		.range([PD, w-wPmap-pd])
		.domain([limDm.xmin, limDm.xmax]);

	var yDmScale = d3.scale.linear()
		.range([hDiamond-PD+2*pd, pd+2*pd])
		.domain([limDm.ymin, limDm.ymax]);

	//axis                    
	var xDmAxis = d3.svg.axis()
		.scale(xDmScale)
		.orient("bottom");

	var yDmAxis = d3.svg.axis()
		.scale(yDmScale)
		.orient("left");

	//path generator
	var LineInDiamonds = d3.svg.line()
    		.x(function(d){return xDmScale(d[0]);})
    		.y(function(d){return yDmScale(d[1]);});

    //cones    
   	svgDiamond.selectAll('.cone')
		.data(ML)
		.enter()
		.append('path')
		.attr('class','cone')
		.attr('d',function(d){
			return LineInDiamonds([
    				[-1000+d,(1/levFactor)*(-1000)],
    				[1000+d,(1/levFactor)*(1000)],
    				[-1000+d,-(1/(1-levFactor))*(-1000)],
    				[1000+d,-(1/(1-levFactor))*(1000)],
    				[-1000+d,(1/levFactor)*(-1000)]]);
			});

	//cone labels
	var MLupdown = ML.concat(ML);
	svgDiamond.selectAll('.coneLabel')
			.data(MLupdown)
			.enter()
			.append('text')
			.attr("class", "coneLabel")
			.attr('x',function(d,i){return (i<ML.length) ? xDmScale(d-100) : xDmScale(d+100);})
	    	.attr('y',function(d,i){return (i<ML.length) ? yDmScale(600) : yDmScale(-600);})
	    	.text('conducting');

	//charge labels
   	svgDiamond.selectAll('.chargeText')
		.data(ML)
		.enter()
		.append('text')
		.attr('class','chargeText')
		.attr('x',function(d,i){return (i<ML.length-1) ? xDmScale((ML[i]+ML[i+1])/2) : xDmScale(ML[i]);})
	   	.attr('y',yDmScale(0))
	   	.text(function(d,i){
	   		if (i>0) {
	   			return '-'+Math.abs(i);
	   		} else if (i<0) {	
	   			return '+'+Math.abs(i);
	   		} else {
				return '0';
	   		};
	   	});


	//mask to hide cones beyond axes limits
	svgDiamond.append('path')
		.attr('class','maskDiamonds')
		.attr('d',function(d){
			return LineInDiamonds([
    				[xDmScale.invert(0),yDmScale.invert(0)],
    				[xDmScale.invert(w-wPmap),yDmScale.invert(0)],
    				[xDmScale.invert(w-wPmap),yDmScale.invert(hDiamond)],
    				[xDmScale.invert(0),yDmScale.invert(hDiamond)],
    				[xDmScale.invert(0),yDmScale.invert(0)],
    				[limDm.xmin,limDm.ymax],
    				[limDm.xmin,limDm.ymin],
    				[limDm.xmax,limDm.ymin],
    				[limDm.xmax,limDm.ymax],
    				[limDm.xmin,limDm.ymax]
    				]);
		});

	//add axis on groups
	var disp_xDmAxis = svgDiamond.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (hDiamond-PD+2*pd) + ")")
		.call(xDmAxis);

	var disp_yDmAxis = svgDiamond.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + PD + ",0)")
		.call(yDmAxis);

    //add text label for the axis
    svgDiamond.append('text') //xAxis
    	.attr('class','axisLabel')
    	.attr('x',(PD+(w-wPmap-pd-PD)/2))
    	.attr('y',(1.6*pd+hDiamond-PD))
    	.attr('dy',40)
    	.text('gate (mV)');

	svgDiamond.append('text') //yAxis
		.attr('class','axisLabel')
		.attr('transform','rotate(-90)')
		.attr('y',PD)
		.attr('x',-(pd+pd+(hDiamond-PD-pd)/2))
		.attr('dy',-45)
		.text('bias (mV)');

	//add mirror axis as lines
	svgDiamond.append('line') //xAxis
		.style('stroke','black')
		.style('shape-rendering','crispEdges')
		.attr('x1',PD)
		.attr('x2',(w-wPmap-pd))
		.attr('y1',(pd+2*pd))
		.attr('y2',(pd+2*pd));

	svgDiamond.append('line') //yAxis
		.style('stroke','black')
		.style('shape-rendering','crispEdges')
		.attr('x1',(w-wPmap-pd))
		.attr('x2',(w-wPmap-pd))
		.attr('y1',(hDiamond-PD+2*pd))
		.attr('y2',(pd+2*pd));

	//horizontal line
  	svgDiamond.append('line')
  		.style('stroke','silver')
  		.style('stroke-width','1')
  		.style('shape-rendering','crispEdges')
  		.attr('x1',PD)
		.attr('x2',(w-wPmap-pd))
		.attr('y1',(pd+2*pd+(hDiamond-PD-pd)/2))
		.attr('y2',(pd+2*pd+(hDiamond-PD-pd)/2));

	//title
	svgDiamond.append('text')
		.attr('class','graphTitle')
		.attr('x',(PD+(w-wPmap-pd-PD)/2))
    	.attr('y',(pd+2*pd))
    	.attr('dy',-10)
    	.text('Stability diagram');

    //biasing bar
    var biasBar = svgDiamond.append('g').attr('id','biasBar');
    	//vertical line
		biasBar.append('line').attr('id','biasLine')
			.attr('x1',xDmScale(0))
    		.attr('x2',xDmScale(0))
    		.attr('y1',yDmScale(limDm.ymin))
    		.attr('y2',yDmScale(limDm.ymax));
    	//slider triangle
		biasTriangle = biasBar.append('g').attr('id','biasTriangle');
		biasTriangle.append('path')
			.attr('d','M '+xDmScale(0)+','+yDmScale(0)+' L '+(xDmScale(0)+20)+','+(yDmScale(0)+10)+' L '+(xDmScale(0)+20)+','+(yDmScale(0)-10)+' L '+xDmScale(0)+','+yDmScale(0));
    		
		biasTriangle.style('cursor', 'ns-resize').call(dragBias);




