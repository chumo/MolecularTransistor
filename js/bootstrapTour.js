<!-- BOOTSTRAP TOUR THROUGH THE APP -->
    // Instance the tour
		var tour = new Tour({
		//onEnd: function(){$("#dock").slideUp();},
  		steps: [
  		{
  			orphan: true,
  			title: "Welcome!",
    		content: "<div style='width:700px;'><p>This is an interactive web application designed to visualize \
        some of the ideas published in <a href='http://dx.doi.org/10.1038/nphys3385' \
        target='_blank'>this article</a> of the scientific journal Nature Physics.</p></br>\
        <p>An individual <a href='https://en.wikipedia.org/wiki/Phthalocyanine' target='_blank'>phthalocyanine</a> molecule adsorbed on a semiconductor surface \
        (<a href='https://en.wikipedia.org/wiki/Indium_arsenide' target='_blank'>InAs</a>(111)A) acts as a <a href='https://en.wikipedia.org/wiki/Coulomb_blockade#Single-electron_transistor' target='_blank'>\
        single electron transistor (SET)</a>.</p></br>\
        <p>The work was partially funded by the German Research Foundation (Collaborative Research Network \
        <a href='http://www.physik.fu-berlin.de/einrichtungen/sfb/sfb658' target='_blank'>SFB 658</a>).</p></br>\
        <p>This web-app has been awarded with the <strong>first prize</strong> in the <a href='http://www.physik.fu-berlin.de/en/einrichtungen/sfb/sfb658/IGK/index.html' target='_blank'>IGK contest (2015)</a> \
        of this publicly funded project. \
        The aim is to impart information about the Sfb 658 to the general public.</p>\
          <div style='text-align:center;'> \
              <img src='images/SFB658_picture.png' alt='Phthalocyanine molecules' width='150px'> \
          </div>\
        <p>Use the arrow keys or the buttons below to walk through this tour.</p></div>"
      },
      {
        orphan: true,
        title: "Single Electron Transistor",
        content: "<p>For having such a nanoscale device, the required elements are:</br>\
        <img src='images/circuit.svg' alt='SET circuit' width='250px' style='float:right;'>\
        <ul> \
            <li><strong>A quantum dot</strong> that should be sufficiently small to host a series of quantized energy levels, and sufficiently decoupled from both electrodes \
            to being able to trap electrons without charge leakage. The phthalocyanine molecule on this surface fulfills these conditions.</li> \
            <li><strong>Source and Drain electrodes:</strong> in this case, the two electrodes are the substrate surface and the tip of a \
            <a href='https://en.wikipedia.org/wiki/Scanning_tunneling_microscope' target='_blank'>scanning tunneling microscope (STM)</a>.</li> \
            <li><strong>A gating voltage</strong> to control the transport through the transistor. In the present case, this is provided by the electrostatic potential of \
            individual indium adatoms (In) deposited around the molecule via atom manipulation with the STM tip. \
            These adatoms are natural electron donors with a charge state +1 (as explained <a href='http://dx.doi.org/10.1088/0953-8984/24/35/354008' target='_blank'>here</a>). \
            This charge is strongly localized due to the low screening of the semiconductor surface, \
            and thus, the local electrostatic potential can be tailored with atomic precission.</li> \
        </ul></p>"
  		},
      {
        element: "#divScene",
        title: "STM junction",
        onShow: function(){$("#divShowButton").text('show 3D SCENE');showButton();},
        content: "<div style='width:400px;'>\
        <p>In this panel you will visualize whatever happens to the physical system as you interact with the app.</p>\
        <p>It presents the side view of the STM experiment, showing the last atoms of the tip (above) and the surface (below). \
        The molecule adsorbs planarily on the surface. Two kinds of phthalocyanines are considered in the study, one with no metal atom \
        and another one with a copper atom in the center. Here are the chemical structures:</br>\
            <div style='text-align:center;'> \
              <img src='images/both_molecules.svg' alt='Phthalocyanine molecules' width='325px'> \
            </div>\
        </p>\
        </div>",
        placement: 'right'
      },
      {
        element: "#divShowButton",
        title: "Show or hide the 3D scene",
        content: "<div style='width:350px;'>Click here to hide the 3D scene and show the full panel with the potential profile (see next).</div>",
        placement: 'right'
      },
      {
        element: "#divPmap",
        onShow: function(){$("#divShowButton").text('show PROFILE');showButton();},
        onNext: function(){$("#divShowButton").text('show 3D SCENE');showButton();},
        title: "Surface potential map",
        content: "<div style='width:450px;'>\
        <p>This panel presents a top view of the surface with a grayscale map of the electrostatic potential. The substrate used \
        in the study, composed of equal amount of indium and arsenic atoms, has a reconstructed surface in which \
        1/4 of the indium atoms are missing.</p>\
        <div style='text-align:center;'> \
          <img src='images/InAs(111)A_unitCell.png' alt='SET circuit' width='300px'>\
        </div>\
        <p>These vacancy sites (red dots) form a 2D lattice of locations where \
        indium adatoms can be possibly deposited.</p>\
        <ul> \
            <li>Deposit an atom at any of the red dots by simply clicking on them. <strong>Try now!</strong></li> \
            <li>Click again on the deposited atom to remove it.</li> \
            <li>The resulting potential at the position of the mouse pointer is shown at the top-left.</li> \
            <li>The blue curve represents the potential profile accross the white horizontal line.</li>\
        </ul>\
        <p>The molecule can also be laterally manipulated, although it only adsorbs at the vacancy sites (red dots). \
        Drag the molecule to relocate it \
        <input type='button' value='show me' onclick='pointInteractive(\"topPc\",\"svgPmap\",\"drag\")'>.\
        <strong>Try now!</strong></p>\
        </div>",
        placement: 'right'
      },
      {
        element: "#divEnergies",
        title: "Energy diagram",
        content: "<div style='width:450px;'>In order to have electrons (green circles) flowing from the tip to the surface \
        or vice versa, two conditions must be fulfilled:\
        <ol> \
            <li>A bias voltage should be applied to one electrode (for example, the tip) with respect to the other (the surface). \
            This produces the unbalance from which the electrons take the energy to run across the junction. \
            Thanks to the <a href='https://en.wikipedia.org/wiki/Quantum_tunnelling' target='_blank'>quantum tunneling effect</a>, \
            some electrons are able to overcome both vacuum barriers \
            (tip-molecule and molecule-surface barriers). Drag the \
            <a href='https://en.wikipedia.org/wiki/Fermi_level' target='_blank'>Fermi level</a> \
            of the tip (blue line) up or down to apply a positive or a negative bias respectively \
            <input type='button' value='show me' onclick='pointInteractive(\"FLevel_1\",\"svgEnergies\",\"drag\")'>.\
            <li>Since the molecule is in between the two electrodes, at least one of its energy levels (purple lines) should \
            exist between both Fermi levels (blue lines). If that is not the case, the current is negligible due to the so called \
            <a href='https://en.wikipedia.org/wiki/Coulomb_blockade' target='_blank'>Coulomb blockade</a>.\
            </li>\
        </ol>\
        Notice also that any molecular level that remains below both Fermi levels, is inevitably occupied by an electron. If we manage to \
        bring more molecular levels down in energy, more electrons will be trapped in the molecule and its total charge will increase in \
        steps of 1 electron charge (see next).\
        </div>",
        placement: 'left'
      },
      {
        element: "#divDiamond",
        title: "Stability diagram",
        content: "<div style='width:550px;'>\
        <p>In a <strong>bias</strong> versus <strong>gate</strong> diagram, if we shade out those areas \
        in which the junction is conducting, we end up with these rhomboidal regions called Coulomb diamonds, where \
        <a href='https://en.wikipedia.org/wiki/Coulomb_blockade' target='_blank'>Coulomb blockade</a> applies. \
        In this case the diamonds are somewhat skewed due to the inherent asymmetry of the STM junction \
        (the molecule-surface barrier is thinner than the tip-molecule barrier).</p>\
        <p>When the system goes from one diamond to the next, the molecule loses or gains one electron.</p>\
        <p>The reason why this diagram presents this topology is related with the fact that the molecular \
        levels shift their energy in two situations:\
        <ol> \
            <li>When the gate voltage is modified. Then, the molecular levels shift an energy equal to the gate \
            potential (multiplied by the electron charge).</li>\
            <li>When the bias voltage is modified. Then, an electric field exists between the two electrodes. \
            Due to the double-barrier at the junction (vacuum barrier between \
            tip and molecule and vacuum barrier between molecule and surface), the molecular levels shift an energy \
            proportional to the voltage drop at the position of the molecule.\
            </li>\
        </ol>\
        </p>\
        <p>Here you can also modify the bias by dragging the blue triangle \
        <input type='button' value='show me' onclick='pointInteractive(\"biasTriangle\",\"svgDiamond\",\"drag\")'>.</p>\
        <p><strong>NOTE:</strong> See how the molecule rotates about its center when the current is flowing. This is because \
        this molecule can adsorb with three different angles, all of them equivalent energetically. The tunneling electrons \
        provide with sufficient energy to move from one angle to the other \
        (see this <a href='http://dx.doi.org/10.1021/nn300690n' target='_blank'>article</a>).</p>\
        </div>",
        placement: 'left'
      },
    	{
    		orphan: true,
  			title: "Have fun!",
    		content: "<div style='width:400px;'>\
        <p>The model stability diagram presented in this web-app is a simplified version of the real experimental one, \
        which has new and interesting features. Check out the \
        <a href='http://dx.doi.org/10.1038/nphys3385' target='_blank'>article</a> to learn more about the physics of this peculiar tiny transistor.</p>\
        <p>If you have any question or comment about this web-app, contact me through my \
        <a href='https://github.com/chumo' target='_blank'>GitHub</a> account. Pull requests are accepted!</p>\
        </div>"
    	}
   		],
  		backdrop: true,
  		template: "<div class='popover tour'> \
    				<div class='arrow'></div> \
    				<h3 class='popover-title'></h3> \
    				<div class='popover-content'></div> \
    					<nav class='popover-navigation'> \
        					<div class='btn-group'> \
            					<button class='btn btn-default' data-role='prev'><</button> \
            					<button class='btn btn-default' data-role='end'>&times;</button> \
            					<button class='btn btn-default' data-role='next'>></button> \
        					</div> \
    					</nav> \
    				</div>" 
		});	

    // Initialize the tour
		tour.init();

    function startIntro(){
			// Start the tour
			//tour.start(true);
			tour.restart();
    };

    //indicator of elements with whom the user can interact
    function pointIElements(){
      var intElements = [
        {
          element:'biasTriangle',
          container:'svgDiamond',
          label:'drag'
        },
        {
          element:'FLevel_1',
          container:'svgEnergies',
          label:'drag'
        },
        {
          element:'topPc',
          container:'svgPmap',
          label:'drag'
        },
        {
          element:'divShowButton',
          container:'svgPmap',
          label:'click'
        }
      ]

      //hide 3D scene to better highlight the button below
      $("#divShowButton").text('show PROFILE');
      showButton();

      for (var i = 0; i < intElements.length; i++) {
        var rectContainer = document.getElementById(intElements[i].container).getBoundingClientRect();
        var rectElement = document.getElementById(intElements[i].element).getBoundingClientRect();
        var cx = rectElement.left - rectContainer.left + rectElement.width/2;
        var cy = rectElement.top - rectContainer.top + rectElement.height/2;

        d3.select('#'+intElements[i].container)
            .append('circle')
            .attr('class','pointer')
            .attr('r',20)
            .attr('cx',cx)
            .attr('cy',cy);
        d3.select('#'+intElements[i].container)
            .append('text')
            .attr('class','pointerLabel')
            .attr('x',cx)
            .attr('y',cy)
            .attr('dy','50')
            .text(intElements[i].label);
      };

      d3.timer(function(t){
        d3.selectAll('.pointer').attr('r',t/25 % 30)
        if (!showPointers) {
          d3.selectAll('.pointer').remove();
          d3.selectAll('.pointerLabel').remove();
          $("#divShowButton").text('show 3D SCENE');showButton();
          return true;
        }
      });

    };

    //indicator of a particular interactive element
    function pointInteractive(element,container,label){
        var rectContainer = document.getElementById(container).getBoundingClientRect();
        var rectElement = document.getElementById(element).getBoundingClientRect();
        var cx = rectElement.left - rectContainer.left + rectElement.width/2;
        var cy = rectElement.top - rectContainer.top + rectElement.height/2;

        d3.select('#'+container)
            .append('circle')
            .attr('class','pointer')
            .attr('r',20)
            .attr('cx',cx)
            .attr('cy',cy);
        d3.select('#'+container)
            .append('text')
            .attr('class','pointerLabel')
            .attr('x',cx)
            .attr('y',cy)
            .attr('dy','50')
            .text(label);

        d3.timer(function(t){
          d3.selectAll('.pointer').attr('r',t/25 % 30)
          if (t>3000) {
            d3.selectAll('.pointer').remove();
            d3.selectAll('.pointerLabel').remove();
            return true;
            }
          });
      };
        







