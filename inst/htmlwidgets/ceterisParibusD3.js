HTMLWidgets.widget({

  name: 'ceterisParibusD3',

  type: 'output',

  factory: function(el, width, height) {


    var instance = {};
    //var id = '#'+el.id;



    var createPlot = function(div, data, dataObs, options){
      return new CeterisParibusPlot(div, data, dataObs, options);
    };


    var CeterisParibusPlot = function(div, data, dataObs, options){
      this.__init__(div, data, dataObs, options);
    };


    CeterisParibusPlot.prototype.__init__ = function(div, data, dataObs, options) {

      this.default_height = 400;
      this.default_width = 600;
      this.default_margins = {top: 10, right: 10, bottom: 40, left: 40};

      this.default_size_rugs = 0.3;
      this.default_alpha_rugs = 0.9;

      this.default_size_residuals = 2;
      this.default_alpha_residuals = 0.9;

      this.default_size_points = 3;
      this.default_alpha_points = 0.9;

      this.default_size_ices = 2.5;
      this.default_size_pdps = 3.5;
      this.default_alpha_ices = 0.4;
      this.default_alpha_pdps = 0.4;

      this.default_color = 'MidnightBlue';
      this.default_color_pdps = 'grey';
      this.default_no_colors = 3;


      // handling user div
      if(typeof(div) == 'string'){
        div = d3.select('#'+div);
      }

      if(!div){
        throw new Error('Container for CeterisParibusPlot do not exist! Stopping execution.');
      }

      this.userDiv_ = div;


      // handling data
      this.data_ = data;
      this.dataObs_ = dataObs;

      //handling options
      this.variables_ = options.variables;


      this.is_color_variable_ = false;

      if (options.hasOwnProperty('color') && options.color !== null ){
        this.color_ = options.color;
        if (dataObs[0].hasOwnProperty(options.color)) { this.is_color_variable_  = true;}
      } else {
        this.color_ = this.default_color;
      }

      if (options.hasOwnProperty('no_colors') && options.no_colors !== null){
        this.no_colors_ = options.no_colors;
      } else {
        this.no_colors_ = this.default_no_colors;
      }



      this.categorical_order_ = options.categorical_order;

      if (options.hasOwnProperty('height') && options.height !== null){
        this.chartHeight_ = options.height;
      } else {
        this.chartHeight_ = this.default_height;
      }

      if (options.hasOwnProperty('width') && options.width !== null){
        this.chartWidth_ = options.width;
      } else {
        this.chartWidth_ = this.default_width;
      }


      //handling graphical options
      if (options.hasOwnProperty('size_rugs') && options.size_rugs !== null){
        this.size_rugs_ = options.size_rugs;
      } else {
        this.size_rugs_ = this.default_size_rugs;
      }

      if (options.hasOwnProperty('alpha_rugs') && options.alpha_rugs !== null){
        this.alpha_rugs_ = options.alpha_rugs;
      } else {
        this.alpha_rugs_ = this.default_alpha_rugs;
      }

      this.color_rugs_ = options.color_rugs;
      this.color_points_ = options.color_points;
      this.color_residuals_ = options.color_residuals;

      if (options.hasOwnProperty('color_pdps') && options.color_pdps !== null){
        this.color_pdps_ = options.color_pdps;
      } else {
        this.color_pdps_ = this.default_color_pdps;
      }


      if (options.hasOwnProperty('alpha_residuals') && options.alpha_residuals !== null){
        this.alpha_residuals_ = options.alpha_residuals;
      } else {
        this.alpha_residuals_ = this.default_alpha_residuals;
      }

      if (options.hasOwnProperty('alpha_points') && options.alpha_points !== null){
        this.alpha_points_ = options.alpha_points;
      } else {
        this.alpha_points_ = this.default_alpha_points;
      }

      if (options.hasOwnProperty('alpha_ices') && options.alpha_ices !== null){
        this.alpha_ices_ = options.alpha_ices;
      } else {
        this.alpha_ices_ = this.default_alpha_ices;
      }

      if (options.hasOwnProperty('alpha_pdps') && options.alpha_pdps !== null){
        this.alpha_pdps_ = options.alpha_pdps;
      } else {
        this.alpha_pdps_ = this.default_alpha_pdps;
      }

      if (options.hasOwnProperty('size_points') && options.size_points !== null){
        this.size_points_ = options.size_points;
      } else {
        this.size_points_ = this.default_size_points;
      }

      if (options.hasOwnProperty('size_residuals') && options.size_residuals !== null){
        this.size_residuals_ = options.size_residuals;
      } else {
        this.size_residuals_ = this.default_size_residuals;
      }

      if (options.hasOwnProperty('size_ices') && options.size_ices !== null){
        this.size_ices_ = options.size_ices;
      } else {
        this.size_ices_ = this.default_size_ices;
      }

      if (options.hasOwnProperty('size_pdps') && options.size_pdps !== null){
        this.size_pdps_ = options.size_pdps;
      } else {
        this.size_pdps_ = this.default_size_pdps;
      }


      this.show_profiles_ = options.show_profiles;
      this.show_observations_ = options.show_observations;
      this.show_rugs_ = options.show_rugs;
      this.show_residuals_ = options.show_residuals;
      this.aggregate_profiles_ = options.aggregate_profiles;

      // handling own CP div

      if(this.userDiv_.select('#mainDivCP')){
        this.userDiv_.select('#mainDivCP').remove();
      }

      var mainDivCP = this.userDiv_.append('div')
      .attr('id', 'mainDivCP')
      .style('height', this.chartHeight_+'px')
      .style('width', this.chartWidth_+'px')
      .style('display',"inline-block")
      .append('table').append('tbody').append('tr');

      this.plotWidth_ = this.is_color_variable_ ? this.chartWidth_*0.8 : this.chartWidth_;

      var plotDivCP = mainDivCP.append('td').append('div').attr('class', 'divTable').attr('id', 'plotDivCP')
      .style('display', 'table')
      .append('div').attr('class', 'divTableBody').style('display','table-row-group')
      .style('height', this.chartHeight_ +'px').style('width', this.plotWidth_ +'px');


      this.scaleColorPrepare_();

      var scaleColor = this.scaleColor_;

      if(this.is_color_variable_){

        var legendDivCP = mainDivCP.append('td').append('div').attr('class', 'divTable').attr('id', 'legendDivCP')
        .style('display', 'table')
        .append('div').attr('class', 'divTableBody').style('display','table-row-group')
        .style('height', this.chartHeight_ +'px').style('width', (this.chartWidth_ - this.plotWidth_) +'px');

        var legendAreaCP = legendDivCP.append('svg').attr('height', this.chartHeight_).attr('width',  (this.chartWidth_ - this.plotWidth_))
        .append('g').attr('id', 'legendAreaCP');

        legendAreaCP.append("text").attr('y', this.chartHeight_/2*0.9).text(this.color_+":");

        var legendKeys = legendAreaCP.append("g").attr("text-anchor", "start").attr("transform", "translate(" + ((this.chartWidth_ - this.plotWidth_)/4) + "," + this.chartHeight_/2 +")")
        .selectAll("g").data(this.scaleColor_.domain()).enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        var rectSize = 10;
        legendKeys.append("rect").attr("x", -rectSize).attr("width", rectSize).attr("height", rectSize).attr("fill", function(d){ return scaleColor(d)});

        legendKeys.append("text").attr("x", 5).attr("y", rectSize/2).attr("dy", "0.32em").text(function(d) { return d; });

        this.legendDivCP_ = legendDivCP;

      }


      this.mainDivCP_ = mainDivCP;
      this.plotDivCP_ = plotDivCP;

      //tooltips
      //jakby cos nie dzialalo to sprawdzic czy dobrze ustawione sa te style css dla div
      var tooltipDiv = plotDivCP.append("div").attr("id", "tooltip").style("opacity",0).style("position", 'absolute').style("height",'auto').style("width", 'auto')
      .style("padding", '5px').style("text-align", 'left').style("background", 'white').style("border", '3px').style("border-radius", '2px').style("box-shadow", '0px 0px 10px 3px rgba(0,0,0,0.5)')
      .style("pointer-events", 'none').style("font", '10px sans-serif');

      this.tooltipDiv_ = tooltipDiv;

      this.createCells_();

      // jesli wprowadzimy warstwy to tu petla po warstwach powinna byc i w petli wywolywac ta funkcje z roznymi parametrami
      this.addingLayer_(this.data_, this.dataObs_, this.show_profiles_, this.show_observations_, this.show_rugs_,
                        this.show_residuals_, this.aggregate_profiles_);




    };

    CeterisParibusPlot.prototype.createCells_ = function() {

      var nCells = this.variables_.length,
      cellIterator = 0,
      rows = Math.floor(Math.sqrt(nCells)),
      cols = Math.floor(Math.ceil( nCells / rows )),
      cellsHeight = Math.floor(this.chartHeight_ / rows),
      cellsWidth = Math.floor(this.plotWidth_ / cols),
      plotDivCP = this.plotDivCP_,
      variables = this.variables_,
      categorical_order = this.categorical_order_,
      scalesX = {},
      data = this.data_,
      dataObs = this.dataObs_,
      margins = this.default_margins,
      size_rugs = this.size_rugs_;

      var cells = plotDivCP.selectAll('.cellRow').data(d3.range(1,rows+1)).enter().append('div')
      .attr('class', 'divTableRow cellRow').style('display', 'table-row')
      .style('height', cellsHeight +'px').style('width', '100%')
      .selectAll('.cell').data(d3.range(1, cols+1)).enter().append('div')
      .attr('class', 'divTableCell cell').style('display', 'table-cell')
      .style('height',  cellsHeight +'px').style('width', cellsWidth +'px')
      .attr('id', function(d,i){
        cellIterator = cellIterator +1;
        if(variables[cellIterator - 1]){
          return variables[cellIterator - 1].replace(".","_")+"_cell";
        } else {
          return 'extra_cell';
        }
      })
      .append('div').attr('class', 'divTable').style('display','table')
      .append('div').attr('class', 'divTableBody cellBody').style('display','table-row-group')
      .style('height',  cellsHeight +'px').style('width', cellsWidth +'px');

      cells = this.userDiv_.selectAll(".cell");

      this.cellsHeight_ = cellsHeight;
      this.cellsWidth_ = cellsWidth;

      // scale Y
      var widthAvail = this.cellsWidth_ - this.default_margins.left - this.default_margins.right,
      heightAvail = this.cellsHeight_ - this.default_margins.top - this.default_margins.bottom;

      this.widthAvail_ = widthAvail;
      this.heightAvail_ = heightAvail;

      var length_rugs = size_rugs * heightAvail * 0.1; // 0.1 - maximum length of rugs is 10% of Y axis height
      this.length_rugs_ = length_rugs;
      var scaleY = d3.scaleLinear().rangeRound([heightAvail - length_rugs - 5, 0]);             //this.length_rugs_


      var minScaleY = d3.min([d3.min(data, function(d) { return d._yhat_; }), d3.min(dataObs, function(d) { return d._y_; })]),
      maxScaleY = d3.max([d3.max(data, function(d) { return d._yhat_; }), d3.max(dataObs, function(d) { return d._y_; })]);

      scaleY.domain([minScaleY ,  maxScaleY]);


      // updating scale domain to shift y doamin upwards
      //var scaleYshift =  Math.abs(scaleY.domain()[1] - scaleY.invert(size_rugs));
      //scaleY.domain([d3.min(data, function(d) { return d["_yhat_"]; }) - scaleYshift, d3.max(data, function(d) { return d["_yhat_"]; })]);


      this.scaleY_ = scaleY;

      cells.each(
        function(d,i){

          if(variables[i]){ // do not plot chart for empty cell

            // cell title
            d3.select(this).append('div').style('background-color', '#c4c4c4').attr('class', 'divTableRow').style('display', 'table-row')
            .append('div').attr('class', 'divTableCell').style('display', 'table-cell')
            .style('text-align', 'center').text(variables[i]);

            // cell chart area
            var chartArea = d3.select(this).append('div').attr('class', 'divTableRow').style('display', 'table-row')
            .append('div').attr('class', 'divTableCell').style('display', 'table-cell')
            .append('svg').attr('height', cellsHeight*0.95).attr('width',  cellsWidth)
            .append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")")
            .attr('class', 'cellMainG').attr('id', 'cellMainG-'+variables[i]);

            chartArea.append("g").attr("class", "axisY")
            .call(d3.axisLeft(scaleY).tickSizeOuter(0).tickSizeInner(-widthAvail).tickPadding(10).ticks(5).tickFormat(d3.format("d")));


            // getting only data prepared for given variable as x variable
            var  dataVar = data.filter( function (d) { return (d._vname_ == variables[i]) }),
            scaleX,
            domain;

            if (typeof dataVar.map(function(x) { return x[variables[i]];}).filter( function(obj){return obj;} )[0] == 'number'){

              scaleX = d3.scaleLinear().rangeRound([0+length_rugs+5, widthAvail]);

              scaleX.domain(d3.extent(dataVar, function(d) { return d[variables[i]]; }));

              chartArea.append("g").attr("transform", "translate(0," + heightAvail + ")")
              .attr("class", "axisX")
              .call(d3.axisBottom(scaleX).tickSizeOuter(0).tickSizeInner(-heightAvail).tickPadding(10).ticks(5).tickFormat(d3.format("d")));


            }
            else if (typeof dataVar.map(function(x) {return x[variables[i]]}).filter(function(obj){return obj;})[0] == 'string') {

              if(categorical_order){
                if(categorical_order.filter(function(x) { return (x.variable == variables[i])})[0]){
                  var order = categorical_order.filter(function(x) { return (x.variable == variables[i])})[0];

                  domain = [];
                  for(var key in order) {
                    if(order.hasOwnProperty(key) && key != 'variable' && order[key] !== null) {
                      domain.push(order[key]);
                    }
                  }
                  scaleX = d3.scalePoint().rangeRound([0+length_rugs, widthAvail]);
                  scaleX.domain(domain);
                  console.log(domain);

                } else {
                scaleX = d3.scalePoint().rangeRound([0+length_rugs, widthAvail]);
                domain = d3.nest().key(function(d){return d[variables[i]]}).entries(dataVar).map(function(x) {return x.key});
                scaleX.domain(domain);

                }

              }
              else{

                scaleX = d3.scalePoint().rangeRound([0+length_rugs, widthAvail]);
                domain = d3.nest().key(function(d){return d[variables[i]]}).entries(dataVar).map(function(x) {return x.key});
                scaleX.domain(domain);
              }

              chartArea.append("g").attr("transform", "translate(0," + heightAvail + ")")
              .attr("class", "axisX")
              .call(d3.axisBottom(scaleX).tickSizeOuter(0).tickSizeInner(-heightAvail).tickPadding(2))
              .selectAll('text').attr('transform', 'rotate(-20)')
              .style("text-anchor", "end");
              //.attr("dy", "-.10em");
              //.attr("x", 9).attr('y',0)

            }
            else {
              var msg = 'Unable to identify type of variable: ' + variables[i] + ' (not a number or a string).';
              throw new Error(msg);
            }



            scalesX[variables[i]] =  scaleX;


            chartArea.append("g").attr("transform", "translate(0," + heightAvail + ")")
            .append("line")
            .attr('stroke', 'black')
            .attr('stroke-width', '1.5px')
            .style("stroke-linecap",'round')
            .attr('y1', 0+0.5)  //0.5 is artificial, related to automatic axis shift about 0.5 (look at d attr for axis path)
            .attr('y2', 0+0.5)
            .attr('x1', 0+0.5)
            .attr('x2', length_rugs+5+0.5);

            chartArea.append("g").attr("transform", "translate(0," + heightAvail + ")")
            .append("line")
            .attr('stroke', 'black')
            .style("stroke-linecap",'round')
            .style('stroke-width', '1.5px')
            .attr('y1', 0)
            .attr('y2', -length_rugs-5)
            .attr('x1', 0+0.5)
            .attr('x2', 0+0.5);


          }
        });

      // customizing axes
      this.userDiv_.selectAll('.domain')
      .style('stroke', 'black')
      .style('stroke-width', '1.5px');

      this.userDiv_.selectAll('.tick line')
      .style('stroke', 'grey')
      .style('stroke-width', '1px')
      .style('stroke-opacity', 0.2);

      this.cellsG_ = this.userDiv_.selectAll(".cellMainG"); //unnecessary?
        this.scalesX_ = scalesX;
    };


    CeterisParibusPlot.prototype.addingLayer_ = function(data, dataObs, show_profiles, show_observations, show_rugs, show_residuals, aggregate_profiles) {

      var self = this;

      this.userDiv_.selectAll(".cellMainG").each(
        function(d,i){

          var variable = d3.select(this).attr('id').split('-')[1], // extracting name of variable for which given cell was created
          dataVar = data.filter( function (d) { return (d._vname_ == variable) });

          if(variable){

            if(show_profiles){ self.icePlot_(d3.select(this), dataVar, dataObs, variable); }
            if(show_observations){ self.pointPlot_(d3.select(this), dataVar, dataObs, variable); }
            if(show_rugs){ self.rugPlot_(d3.select(this), dataVar, dataObs, variable);}
            if(show_residuals){ self.residualPlot_(d3.select(this), dataVar, dataObs, variable); }
            if(aggregate_profiles){ self.pdpPlot_(d3.select(this), dataVar, dataObs, variable, aggregate_profiles); }
          }
        }
      );
    };

    CeterisParibusPlot.prototype.icePlot_ = function(mainG, dataVar, dataObs, variable) {

      //var no_instances; //this.no_instances or whatever
      //if(!no_instances){ no_instances = 1;}else{no_instances = no_instances + 1;}

      var g = mainG.append("g").attr("class", 'icePlot'),//.attr('id', 'icePlot'+no_instances)
      per_id_model= d3.nest().key(function(d){return d._ids_+ '|' + d._label_}).entries(dataVar),
      scaleY = this.scaleY_,
      scaleColor = this.scaleColor_,
      scaleX = this.scalesX_[variable],
      color = this.color_,
      tooltipDiv = this.tooltipDiv_,
      alpha_ices = this.alpha_ices_,
      size_ices = this.size_ices_,
      self = this,
      is_color_variable = this.is_color_variable_;

      var line = d3.line()
      .x(function(d) { return scaleX(d[variable]); })
      .y(function(d) { return scaleY(d._yhat_); });


      var iceplotegroups = g.selectAll('g.iceplotgroup').data(per_id_model).enter().append('g').attr('class', 'iceplotgroup');

      var iceplotlines = iceplotegroups.append("path").attr('class', 'iceplotline')
      //.attr('id', function(x) {return 'iceplotline-' + x.key})
      .attr("fill", "none")                                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(!is_color_variable){
          return color;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_ + '|' + d._label_) == x.key; })[0][color]);
        }
      })
      .attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", size_ices)
      .attr('opacity', alpha_ices)
      .attr("d", function(x){return line(x.values)});


      var iceplotpoints = iceplotegroups.append('g').attr('class','iceplotpointgroup').selectAll('circle.iceplotpoint').data(function(d){ return d.values}).enter()
      .append("circle").attr('class', 'iceplotpoint')
      //.attr('id', function(x) {return 'iceplotpoint-' + x.key})
      .attr("fill", 'black') //function(x) { return scaleColor(dataObs.filter(function(d) {return (d['_ids_']+ '|' + d['_label_']) == x.key; })[0][color])})               }
    .attr("stroke" , 'black') // function(x) { return scaleColor(dataObs.filter(function(d) {return (d['_ids_']+ '|' + d['_label_']) == x.key; })[0][color])})
    .attr('stroke-opacity', '0.2')
    .attr('stroke-width', size_ices)
    .attr('r', size_ices) // uzaleznic to od czegos gdy rozmiar wykresu sie bedziez zmieniac
    .attr('opacity', 0)
    .attr('cx', function(d) { return scaleX(d[variable]); })
    .attr('cy', function(d) { return scaleY(d._yhat_);});


    iceplotpoints
    .on("mouseover", function(d){

      tooltipDiv.html( "<b> ICE line </b> <br/>" +
                         "obs. id: " + d._ids_ +  "<br/>" +
                         "model: " + d._label_ +  "<br/>" +
                         "y_pred: " + d._yhat_.toFixed(2) +  "<br/>" +
                         variable + ": " + d[variable] +  "<br/>"
      )
      .style("left", (d3.event.pageX ) + "px") // ustalamy pozycje elementu tam gdzie zostanie akcja podjeta
      .style("top", (d3.event.pageY) + "px")
      .transition()
      .duration(300)
      .style("opacity",1);

      d3.select(this)
      .transition()
      .duration(300)
      .style("stroke-width", size_ices+2)
      .attr('opacity', 1);

      var id = d._ids_,
      model = d._label_;

      self.userDiv_.selectAll(".iceplotline").filter(function(d) {return (id+ '|' + model) == d.key; })
      .transition()
      .duration(300)
      .style("stroke-width", size_ices+2)
      .attr('opacity', 1);


    });

    iceplotpoints
    .on("mouseout", function(d){

      d3.select(this)
      .transition()
      .duration(300)
      .style("stroke-width", size_ices)
      .attr('opacity', 0);


      var id = d._ids_,
      model = d._label_;

      self.userDiv_.selectAll(".iceplotline").filter(function(d) {return (id+ '|' + model) == d.key; })
      .transition()
      .duration(300)
      .style("stroke-width", size_ices)
      .attr('opacity', alpha_ices);

      tooltipDiv
      .transition()
      .duration(300)
      .style("opacity", 0);
    });

    };

    CeterisParibusPlot.prototype.pointPlot_ = function(mainG, dataVar, dataObs, variable) {

      var g = mainG.append("g").attr("class", 'pointPlot'),//.attr('id', 'pointPlot'+no_instances)
      per_id_model= d3.nest().key(function(d){return d._ids_+ '|' + d._label_}).entries(dataVar),
      scaleY = this.scaleY_,
      scaleColor = this.scaleColor_,
      scaleX = this.scalesX_[variable],
      color = this.color_,
      tooltipDiv = this.tooltipDiv_,
      alpha_points = this.alpha_points_,
      size_points = this.size_points_,
      color_points = this.color_points_,
      self = this;

      var pointplots = g.selectAll('circle.point').data(per_id_model).enter().append("circle").attr('class', 'point')
      //.attr('id', function(x) {return 'linechart-' + x.key})
      .attr("fill", function(x) {
        if(color_points){
          return color_points;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(color_points){
          return color_points;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )
      .attr("stroke-width", '1px')
      .attr("opacity",alpha_points)
      .attr('r', size_points)
      .attr('cx', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][variable]); })
      .attr('cy', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0]._yhat_);});

      pointplots
      .on("mouseover", function(d){

        var dataPoint = dataObs.filter(function(x) {return (x._ids_+ '|' + x._label_) == d.key; })[0];

        tooltipDiv.html( "<b> Predicted point </b> <br/>" +
                           "obs. id: " + dataPoint._ids_ +  "<br/>" +
                           "model: " + dataPoint._label_ +  "<br/>" +
                           "y_pred: " + dataPoint._yhat_.toFixed(2) +  "<br/>" +
                           variable + ": " + dataPoint[variable] +  "<br/>"
        )
        .style("left", (d3.event.pageX ) + "px") // ustalamy pozycje elementu tam gdzie zostanie akcja podjeta
        .style("top", (d3.event.pageY) + "px")
        .transition()
        .duration(300)
        .style("opacity",1);

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", "4px");

        self.userDiv_.selectAll(".point").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x.key; })
        .transition()
        .duration(300)
        .style("stroke-width", "4px");


      });

      pointplots
      .on("mouseout", function(d){

        var dataPoint = dataObs.filter(function(x) {return (x._ids_+ '|' + x._label_) == d.key; })[0];

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", "1px");

        self.userDiv_.selectAll(".point").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x.key; })
        .transition()
        .duration(300)
        .style("stroke-width", "1px");

        tooltipDiv
        .transition()
        .duration(300)
        .style("opacity", 0);
      });

    };

    CeterisParibusPlot.prototype.rugPlot_ = function(mainG, dataVar, dataObs, variable) {

      var g = mainG.append("g").attr("class", 'rugPlot'),//.attr('id', 'rugPlot'+no_instances)
      per_id_model= d3.nest().key(function(d){return d._ids_+ '|' + d._label_}).entries(dataVar),
      scaleY = this.scaleY_,
      scaleColor = this.scaleColor_,
      scaleX = this.scalesX_[variable],
      color = this.color_,
      heightAvail = this.heightAvail_,
      length_rugs = this.length_rugs_,
      alpha_rugs = this.alpha_rugs_,
      color_rugs = this.color_rugs_;

      // rugs for x axis
      g.selectAll('line.rugx').data(per_id_model).enter().append("line").attr('class', 'rugx')
      //.attr('id', function(x) {return 'rugxchart-' + x.key})
      .attr("fill", function(x) {
        if(color_rugs){
          return color_rugs;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(color_rugs){
          return color_rugs;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )
      .attr("opacity", alpha_rugs)
      .attr('y1', heightAvail)
      .attr('y2', heightAvail - length_rugs)      //-length_rugs
      .attr('x1', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][variable]); })
      .attr('x2', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][variable]); });

      // rugs for y axis
      g.selectAll('line.rugy').data(per_id_model).enter().append("line").attr('class', 'rugy')
      //.attr('id', function(x) {return 'rugychart-' + x.key})
      .attr("fill", function(x) {
        if(color_rugs){
          return color_rugs;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(color_rugs){
          return color_rugs;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0][color])}
      }
      )
      .attr("opacity", alpha_rugs)
      .attr('x1', 0)
      .attr('x2', 0 + length_rugs)//     +length_rugs
      .attr('y1', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0]._yhat_);})
      .attr('y2', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x.key; })[0]._yhat_);});

    };

    CeterisParibusPlot.prototype.residualPlot_ = function(mainG, dataVar, dataObs, variable) {

      var g = mainG.append("g").attr("class", 'residualPlot'),//.attr('id', 'residualPlot'+no_instances)
      id_model= d3.nest().key(function(d){return d._ids_+ '|' + d._label_}).entries(dataVar).map(function(x) {return x.key}),
      scaleY = this.scaleY_,
      scaleColor = this.scaleColor_,
      scaleX = this.scalesX_[variable],
      color = this.color_,
      tooltipDiv = this.tooltipDiv_,
      alpha_residuals = this.alpha_residuals_,
      size_residuals = this.size_residuals_,
      color_residuals = this.color_residuals_,
      self = this;

      // residual lines
      var residuallines = g.selectAll('line.residualline').data(id_model).enter().append("line").attr('class', 'residualline')
      //.attr('id', function(x) {return 'residuallinechart-' + x})
      .attr("fill", function(x) {
        if(color_residuals){
          return color_residuals;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][color])}
      }
      )                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(color_residuals){
          return color_residuals;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][color])}
      }
      )
      .attr("opacity", alpha_residuals)
      .attr("stroke-width", '2px')
      .attr("stroke-linecap", "round")
      .attr('x1', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][variable]); })
      .attr('x2', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][variable]); })
      .attr('y1', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0]._yhat_); })
      .attr('y2', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0]._y_); }) ;

      // residaul points
      var residualpoints = g.selectAll('circle.residualpoint').data(id_model).enter().append("circle").attr('class', 'residualpoint')
      //.attr('id', function(x) {return 'residualpointchart-' + x})
      .attr("fill", function(x) {
        if(color_residuals){
          return color_residuals;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][color])}
      }
      )                                         //[0] to get array inside structure {{cos}}
      .attr("stroke", function(x) {
        if(color_residuals){
          return color_residuals;
        } else {
          return scaleColor(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][color])}
      }
      )
      .attr("stroke-width", '1px')
      .attr("opacity", alpha_residuals)
      .attr('r', size_residuals) // uzaleznic to od czegos
      .attr('cx', function(x) { return scaleX(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0][variable]); })
      .attr('cy', function(x) { return scaleY(dataObs.filter(function(d) {return (d._ids_+ '|' + d._label_) == x; })[0]._y_);});

      residualpoints
      .on("mouseover", function(d){

        var dataPoint = dataObs.filter(function(x) {return (x._ids_+ '|' + x._label_) == d; })[0];

        tooltipDiv.html( "<b> Data point </b> <br/>" +
                           "obs. id: " + dataPoint._ids_ +  "<br/>" +
                           "y: " + dataPoint._y_.toFixed(2) +  "<br/>" +
                           "y_pred: " + dataPoint._yhat_.toFixed(2) +  "<br/>" +
                           "<b> residual: " + (dataPoint._y_ - dataPoint._yhat_).toFixed(2) +  "</b> <br/>" +
                           variable + ": " + dataPoint[variable] +  "<br/>"
        )
        .style("left", (d3.event.pageX ) + "px") // ustalamy pozycje elementu tam gdzie zostanie akcja podjeta
        .style("top", (d3.event.pageY) + "px")
        .transition()
        .duration(300)
        .style("opacity",1);

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", "4px");

        self.userDiv_.selectAll(".residualpoint").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x; })
        .transition()
        .duration(300)
        .style("stroke-width", "4px");

        self.userDiv_.selectAll(".residualline").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x; })
        .transition()
        .duration(300)
        .style("stroke-width", "4px");

      });


      residualpoints
      .on("mouseout", function(d){

        var dataPoint = dataObs.filter(function(x) {return (x._ids_+ '|' + x._label_) == d; })[0];

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", "1px");

        self.userDiv_.selectAll(".residualpoint").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x; })
        .transition()
        .duration(300)
        .style("stroke-width", "1px");

        self.userDiv_.selectAll(".residualline").filter(function(x) {return (dataPoint._ids_+ '|' +  dataPoint._label_) == x; })
        .transition()
        .duration(300)
        .style("stroke-width", "1px");

        tooltipDiv
        .transition()
        .duration(300)
        .style("opacity", 0);

      });

    };


    CeterisParibusPlot.prototype.pdpPlot_ = function(mainG, dataVar, dataObs, variable, aggregate_profiles){

      var g = mainG.append("g").attr("class", 'pdpPlot'),//.attr('id', 'pdpPlot'+no_instances)
      scaleY = this.scaleY_,
      scaleColor = this.scaleColor_,
      scaleX = this.scalesX_[variable],
      color = this.color_,
      tooltipDiv = this.tooltipDiv_,
      alpha_pdps = this.alpha_pdps_,
      size_pdps = this.size_pdps_,
      color_pdps = this.color_pdps_,
      self = this;

      var nested_data;

      if(aggregate_profiles == 'mean'){
        nested_data = d3.nest()
        .key(function(d) { return d._label_; })
        .key(function(d) { return d[variable]; })
        .rollup(function(leaves) { return d3.mean(leaves, function(d) {return d._yhat_;}); })
        .entries(dataVar);
      }
      if(aggregate_profiles == 'median'){
        nested_data = d3.nest()
        .key(function(d) { return d._label_; })
        .key(function(d) { return d[variable]; })
        .rollup(function(leaves) { return d3.median(leaves, function(d) {return d._yhat_;}); })
        .entries(dataVar);
      }


      var line = d3.line()
      .x(function(d) { if(typeof scaleX.domain()[0] == 'number'){ return scaleX(parseFloat(d.key));} else{ return scaleX(d.key);} })
      .y(function(d) { return scaleY(d.value); });

      var pdpgroups = g.selectAll('g.pdpgroup').data(nested_data).enter().append('g').attr('class', 'pdpgroup');

      var pdplines = pdpgroups.append("path").attr('class', 'pdpline')
      //.attr('id', function(x) {return 'pdpchart-' + x.key})
      .attr("fill", "none")
      .attr("stroke", function(x) { if(color == '_label_') {return scaleColor( x.key);}else{return color_pdps;}})
      .attr("stroke-linejoin", "round").attr("stroke-linecap", "round")
      .attr("stroke-width", size_pdps)
      .attr('opacity', alpha_pdps)
      .attr("d", function(x){ return line(x.values)});

      var pdppoints = pdpgroups.append('g').attr('class','pdppointgroup').selectAll('circle.pdpplotpoint').data(function(d){ return d.values}).enter()
      .append("circle").attr('class', 'pdpplotpoint')
      //.attr('id', function(x) {return 'pdpplotpoint-' + x.key})
      .attr("fill", 'black')
      .attr("stroke" , 'black')
      .attr('stroke-opacity', '0.2')
      .attr('stroke-width', size_pdps)
      .attr('r', size_pdps) // uzaleznic to od czegos gdy rozmiar wykresu sie bedziez zmieniac
      .attr('opacity', 0)
      .attr('cx', function(d) { return scaleX(d.key); })
      .attr('cy', function(d) { return scaleY(d.value);});

      pdppoints
      .on("mouseover", function(d){

        var model = d3.select(this.parentNode.parentNode).datum().key;

        tooltipDiv.html( "<b> PDP line </b> <br/>" +
                           "model: " + model +  "<br/>" +
                           "y_pred: " + d.value.toFixed(2) +  "<br/>" +
                           variable + ": " + d.key +  "<br/>"
        )
        .style("left", (d3.event.pageX ) + "px") // ustalamy pozycje elementu tam gdzie zostanie akcja podjeta
        .style("top", (d3.event.pageY) + "px")
        .transition()
        .duration(300)
        .style("opacity",1);

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", size_pdps+2)
        .attr('opacity', 1);


        self.userDiv_.selectAll(".pdpline").filter(function(d) {return model == d.key; })
        .transition()
        .duration(300)
        .style("stroke-width", size_pdps+2)
        .attr('opacity', 1);

      });

      pdppoints
      .on("mouseout", function(d){

        d3.select(this)
        .transition()
        .duration(300)
        .style("stroke-width", size_pdps)
        .attr('opacity', 0);


        var model = d3.select(this.parentNode.parentNode).datum().key;

        self.userDiv_.selectAll(".pdpline").filter(function(d) {return model == d.key; })
        .transition()
        .duration(300)
        .style("stroke-width", size_pdps)
        .attr('opacity', alpha_pdps);

        tooltipDiv
        .transition()
        .duration(300)
        .style("opacity", 0);
      });


    };


    CeterisParibusPlot.prototype.scaleColorPrepare_ = function(){

       //console.log('EVOKING this INSIDE CeterisParibusPlot.scaleColorPrepare_')
       //console.log(this)

       var no_colors = this.no_colors_,
           default_color = this.default_color ,
           defaultPaletteCat = d3.schemePaired,
           defaultPaletteNum = d3.schemeOrRd,
           color = this.color_,
           dataObs = this.dataObs_;

        this.scaleColor_ = {};

        if (typeof dataObs.map(function(x) { return x[color];}).filter( function(obj){return obj;} )[0] == 'string'){
            //console.log('color variable is categorical')
            this.scaleColor_ = d3.scaleOrdinal(defaultPaletteCat);
            this.scaleColor_.domain(d3.nest().key(function(d){return d[color]}).entries(dataObs).map(function(x) {return x.key}));
        }
        else if (typeof dataObs.map(function(x) {return x[color]}).filter(function(obj){return obj;})[0] == 'number') {
            var scale = d3.scaleOrdinal(defaultPaletteNum[no_colors]),
            scaleMin = d3.min(dataObs.map(function(x) {return x[color]})),
            scaleMax = d3.max(dataObs.map(function(x) {return x[color]})),
            scaleDivisions = d3.range(scaleMin, scaleMax, (scaleMax - scaleMin)/no_colors) ,
            scaleDomain = [];

            scaleDivisions.push(scaleMax);
            scaleDivisions = scaleDivisions.map(function(x) {return x.toFixed(2)});

            scaleDivisions.forEach(function(d,i) {if(i < scaleDivisions.length - 1){scaleDomain.push('['+ d +';')}});
            scaleDivisions.forEach(function(d,i) {
            if(i > 0){
                if(i == scaleDivisions.length - 1) {
                    scaleDomain[i-1] = scaleDomain[i-1] + d + ']';
                } else {
                    scaleDomain[i-1] = scaleDomain[i-1] + d + ')';
                }}});

            scale.domain(scaleDomain);

            // IE 9 > not supporting .indexOf, needed below
            var getPosition = function (elementToFind, arrayElements) {
                                    var i;
                                    for (i = 0; i < arrayElements.length; i += 1) {
                                        if (arrayElements[i] === elementToFind) {
                                            return i;
                                        }
                                    }
                                    return null; //not found
                                };

            var scaleNew = function(x) {
                // if we give scale argument from its domain it also should work"
                if (getPosition(x, scale.domain())) {
                    var position = getPosition(x, scale.domain());
                    return scale.range()[position];
                } else {
                    var whichRange = [];
                    scaleDivisions.forEach(function(d,i){

                        if(i > 0){
                            if(i < scaleDivisions.length - 1){
                                if(x < d ){ whichRange.push(i)}
                            } else {
                                if(x <= d ){whichRange.push(i)}
                            }
                        }
                     });

                    return scale(scaleDomain[d3.min(whichRange)-1]);
                  }

             };

            scaleNew.domain = scale.domain;
            scaleNew.range = scale.range;
            scaleNew.unknown = scale.unknown;
            scaleNew.copy = scale.copy;

            this.scaleColor_ = scaleNew;
        }
        else {
            //console.log('color variable not defined')
            this.scaleColor_ = d3.scaleOrdinal();
            this.scaleColor_.range([default_color]);
            this.scaleColor_.domain('default');
        }
    };




    return {

      renderValue: function(x) {

        //console.log('renderValue, id'+el.id);

        // to take unique variables name
        x.options.variables = d3.map(x.options.variables, function(d){return d;}).keys();

        var instance = new createPlot(div = el.id,
                       data = x.data,
                       dataObs = x.dataObs,
                       options = x.options
                       );

        //console.log(x.options)
        //console.log(instance)

        instance.x = x;

      },

      resize: function(width, height) {


        //console.log('resize, id'+el.id);
        /*console.log(instance.x);

        new createPlot(div = el.id,
                       data = instance.x.data,
                       dataObs = instance.x.dataObs,
                       options = instance.x.options
                       );
        */
        // this.renderValue(instance.data);

      }

    };
  }
});
