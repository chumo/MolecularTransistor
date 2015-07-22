    var surfaceYpx = LProf-pd/2;
    var tsdUp = 30; //tip surface distance when tip is up
    var tsdDown = 5; //tip surface distance when tip is down
    var smd = 10; //surface-molecule distance
    var manipDistance = 15; //distance that the tip should approach to the surface during lateral manipulation of the molecule
    //depth linear scale for rendering the scene (closer to the screen is larger)
    var depth = d3.scale.linear()
        .range([0.71,1.1])
        .domain([lim.xmin, lim.xmax]);

    //vacuum
    svgScene.append('rect')
        .attr('id','vacuum')
        .attr('x',PD)
        .attr('y',2*pd)
        .attr('width',LSurf)
        .attr('height',LProf-pd)
        .style('fill','url(#sceneGradient)');

    //surface
	svgScene.append('image')
    	.attr('alt','InAs(111)A surface')
    	.attr('x',PD)
    	.attr('y',surfaceYpx)
    	.attr('width',LSurf)
    	.attr('height',LSurf*113/1587) 
    	.attr('xlink:href','images/InAs(111)A.png');

	svgScene.append('rect')
		.attr('class','surfMask')
    	.attr('x',PD)
    	.attr('y',surfaceYpx)
    	.attr('width',LSurf)
    	.attr('height',pd+LProf-surfaceYpx)
        .style('fill','url(#surfMaskGradient)');

    //tip
    var tip = svgScene
			.append('g')
			.attr('id','tip');

	tip.append('image')
    	.attr('alt','STM tip')
    	.attr('x',-110)
    	.attr('y',-220*326/335)
    	.attr('width',220)  
    	.attr('height',220*326/335)
    	.attr('xlink:href','images/TIP.png');

    tip.attr('transform','translate('+xScale(0)+','+(surfaceYpx-tsdUp)+')scale('+depth(0)+')');

    //adatoms
    function renderAdatoms(){
        var coords=[];
        for (var i = 0; i < atomLocs.length; i++) {
            coords.push([ adsites[atomLocs[i]][0] , adsites[atomLocs[i]][1] ]);
        };

        //join data
        adatoms = svgScene.selectAll('.adatom').data(coords);

        //update
        adatoms
            .attr('class','adatom')
            .attr('r',function(d){
                return depth(d[1])*Radatom;})
            .attr('cx',function(d){return xScale(d[0])})
            .attr('cy',function(d){return surfaceYpx-depth(d[1])*Radatom;});

        //enter
        adatoms
            .enter()
            .append('circle')
            .attr('class','adatom')
            .transition()
            .delay(200)
            .attr('r',function(d){
                return depth(d[1])*Radatom;})
            .attr('cx',function(d){return xScale(d[0])})
            .attr('cy',function(d){return surfaceYpx-depth(d[1])*Radatom;});

        //exit
        adatoms
            .exit()
            .transition()
            //.delay(50)
            .remove();

        //sort by Y coordinate the group of adatoms plus the molecule, to provide a proper depth render
        svgScene.selectAll('.adatom, #sidePc').sort(function(a,b){return a[1]-b[1]});
    };
    
    //molecule
    var sidePc = svgScene
            .append('g')
            .data([posMol]) //this is necessary for rendering the 3d scene later on
            .attr('id','sidePc');

    var side0 = sidePc.append('image')
        .attr('alt','Pc molecule')
        .attr('x','-30')
        .attr('y','-30')
        .attr('width',60)
        .attr('height',60)
        .attr('xlink:href','images/side0.png');

    var side1 = sidePc.append('image')
        .attr('alt','Pc molecule')
        .attr('x','-30')
        .attr('y','-30')
        .attr('width',60)
        .attr('height',60)
        .attr('xlink:href','images/side1.png');

    var side2 = sidePc.append('image')
        .attr('alt','Pc molecule')
        .attr('x','-30')
        .attr('y','-30')
        .attr('width',60)
        .attr('height',60)
        .attr('xlink:href','images/side2.png');

    sidePc.attr('transform','translate('+xScale(0)+','+(surfaceYpx-smd*depth(0))+')scale('+depth(0)+')');

    //at start, only the first frame is visible
    side1.style('display','none');
    side2.style('display','none');

    //electron that is animated according to transportElectron (see svgEnergies)
    var elecZ = d3.scale.linear()
        .range([surfaceYpx+40,surfaceYpx-tsdUp-40])
        .domain([xEnScale(lMargin+2*bandW+2*wellW+gapW), xEnScale(lMargin)]); //I use this domain to put sceneElectron and transportElectron 
                                                          //in phase inside the timer function that animates the current.

    var sceneElectron = svgScene
                        .append('circle')
                        .attr('class','electron')
                        .attr('cx',xScale(posMol[0]))
                        .attr('cy',elecZ(lMargin))
                        .attr('r','0');

    //mask to hide the tip behind the square
    svgScene.append('rect')
        .attr('class','mask')
        .attr('width',wPmap)
        .attr('height',2*pd);

    svgScene.append('rect')
        .attr('class','mask')
        .attr('width',PD)
        .attr('height',2*pd+LProf);

    svgScene.append('rect')
        .attr('class','mask')
        .attr('x',PD+LSurf)
        .attr('y',0)
        .attr('width',wPmap-PD-LSurf)
        .attr('height',2*pd+LProf);

    svgScene.append('rect')
        .attr('class','mask')
        .attr('x',0)
        .attr('y',pd+LProf)
        .attr('width',wPmap)
        .attr('height',pd);

    //frame
    svgScene.append('rect')
        .attr('class','frame')
        .attr('x',PD)
        .attr('y',2*pd)
        .attr('width',LSurf)
        .attr('height',LProf-pd);

    //title
    svgScene.append('text')
        .attr('class','graphTitle')
        .attr('x',(wPmap/2+PD/2))
        .attr('y',(pd+pd))
        .attr('dy',-10)
        .text('What happens at the junction?');

    //subpanel title
    svgScene.append('text')
        .attr('class','graphTitle')
        .attr('transform','rotate(-90)')
        .attr('y',PD)
        .attr('x',-(pd+LProf/2))
        .attr('dy',-15)
        .style('fill','#828282')
        .text('SIDE view');





