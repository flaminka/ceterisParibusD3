HTMLWidgets.widget({

  name: 'ceterisParibusD3',

  type: 'output',

  factory: function(el, width, height) {
    

    var instance = {};
    var id = '#'+el.id;
    
    var margin = {top: 10, right: 10, bottom: 40, left: 40};

    var scaleColor = function(dataObs, color){

       var nColors = 3,
           defaultColor = 'steelblue',
           defaultPaletteCat = d3.schemePaired, 
           defaultPaletteNum = d3.schemeOrRd;
      
        var scale;

        if (typeof dataObs.map(function(x) {return x[color]}).filter( function(obj){return obj;} )[0] == 'string'){
            //console.log('color variable is categorical')  
            scale = d3.scaleOrdinal(defaultPaletteCat);

            scale.domain(d3.nest().key(function(d){return d[color]}).entries(dataObs).map(function(x) {return x.key}));
            return scale;
        }
        else if (typeof dataObs.map(function(x) {return x[color]}).filter(function(obj){return obj;})[0] == 'number') {
            //console.log('color variable is numerical')  
                scale = d3.scaleOrdinal(defaultPaletteNum[noColors]),
                scaleMin = d3.min(dataObs.map(function(x) {return x[color]})),
                scaleMax = d3.max(dataObs.map(function(x) {return x[color]})),
                scaleDivisions = d3.range(scaleMin, scaleMax, (scaleMax - scaleMin)/noColors) ,
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

            var scaleNew = function(x) { 
            
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
    
             };

            scaleNew.domain = scale.domain;
            scaleNew.range = scale.range;
            scaleNew.unknown = scale.unknown;
            scaleNew.copy = scale.copy;

            return scaleNew;
        }
        else {
            //console.log('color variable not defined')
            scale = d3.scaleOrdinal();
            scale.range([defaultColor]);
            scale.domain('default');
            return scale;
        } 

    };

    var init = function(htmlSectionId, variables, color, scaleColor, height, width){

        //to be removed and replace with enter-exit D3 update scheme
       if(d3.select('#CP-mainDiv')){
          console.log('removed');
          d3.select('#CP-mainDiv').remove();
        }

        var mainDiv = d3.select(htmlSectionId).append('div').attr('id', 'CP-mainDiv')
                        .style('height', height+'px').style('width', width+'px')
                        .style('display',"inline-block")
                        .append('table').append('tbody').append('tr');

        var plotWidth = color ? width*0.8 : width;

        var plotDiv = mainDiv.append('td').append('div').attr('class', 'divTable').attr('id', 'CP-plotDiv')
                             .style('display', 'table')
                             .append('div').attr('class', 'divTableBody').style('display','table-row-group')
                             .style('height', height +'px').style('width', plotWidth +'px');

        var nCells = variables.length,
            cellIterator = 0,
            rows = Math.floor(Math.sqrt(nCells)),
            cols = Math.floor(Math.ceil( nCells / rows )),
            cellsHeight = Math.floor(height / rows),
            cellsWidth = Math.floor(plotWidth / cols);

        var mainCells = plotDiv.selectAll('.divTableRow').data(d3.range(1,rows+1)).enter().append('div')
                               .attr('class', 'divTableRow').style('display', 'table-row').attr('id', function(d){return 'divTableRow'+d})
                               .style('height', cellsHeight+'px').style('width', '100%')
                               .selectAll('.plotdivTableCell').data(d3.range(1, cols+1)).enter().append('div')
                               .attr('class', 'divTableCell plotdivTableCell').style('display', 'table-cell')
                               .attr('id', function(d){ cellIterator = cellIterator +1; return 'divTableCell'+cellIterator})
                               .style('height',  cellsHeight+'px').style('width', cellsWidth+'px');

        if(color){

            var legendDiv = mainDiv.append('td').append('div').attr('class', 'divTable').style('display', 'table').attr('id', 'CP-legendDiv')
                                .append('div').attr('class', 'divTableBody').style('display','table-row-group')
                                .style('height', height +'px').style('width', (width - plotWidth) +'px'); 

            var legendG = legendDiv.append('svg').attr('height', height).attr('width',  (width - plotWidth))
                                .append('g').attr('id', 'CP-singleLinePlot-legendArea');

            legendG.append("text").attr('y', height/2*0.9).text(color+":");

            var legendKeys = legendG.append("g").attr("text-anchor", "start").attr("transform", "translate(" + ((width - plotWidth)/4) + "," + height/2 +")")
                                    .selectAll("g").data(scaleColor.domain()).enter().append("g")
                                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            var rectSize = 10;
            legendKeys.append("rect").attr("x", -rectSize).attr("width", rectSize).attr("height", rectSize).attr("fill", function(d){ return scaleColor(d)});

            legendKeys.append("text").attr("x", 5).attr("y", rectSize/2).attr("dy", "0.32em").text(function(d) { return d; });

        }

        return {cells: d3.selectAll('.plotdivTableCell'), cellsHeight: cellsHeight, cellsWidth: cellsWidth};
    };


    var icePlot = function(mainDiv, cellsHeight, cellsWidth, data, dataObs, variable, color, scaleY, heightAvail, widthAvail, scaleColor) {
      
        var no_instances;
        if(!no_instances){ no_instances = 1;}else{no_instances = no_instances + 1;}
        
        var div = mainDiv.append('div').attr('class', 'divTable CP-singleLinePlot').style('display','table').attr('id', 'CP-singleLinePlot'+no_instances)
                        .append('div').attr('class', 'divTableBody CP-singleLinePlot').style('display','table-row-group')
                        .style('height',  cellsHeight+'px').style('width', cellsWidth+'px');
        
        var titleDiv = div.append('div').style('background-color', '#c4c4c4').attr('class', 'divTableRow CP-singleLinePlot').style('display', 'table-row')
                            .append('div').attr('class', 'divTableCell CP-singleLinePlot').style('display', 'table-cell')
                            .style('text-align', 'center').text(variable);        
        
        var chartDiv = div.append('div').attr('class', 'divTableRow CP-singleLinePlot').style('display', 'table-row')
                            .append('div').attr('class', 'divTableCell CP-singleLinePlot').style('display', 'table-cell');
        
        // chart
        var svg = chartDiv.append('svg').attr('height', cellsHeight*0.95).attr('width',  cellsWidth);
                    
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr('id', 'CP-singleLinePlot'+no_instances+'-chartArea');
        
        // getting only data prepared for given variable as x variable
        var  dataVar = data.filter( function (d) { return (d["_vname_"] == variable) }),
            models = d3.nest().key(function(d){return d['_label_']}).entries(dataObs).map(function(x) {return x.key});  
            
        var scaleX = d3.scaleLinear().rangeRound([0, widthAvail]);

        scaleX.domain(d3.extent(dataVar, function(d) { return d[variable]; }));

        var line = d3.line()
                     .x(function(d) { return scaleX(d[variable]); })
                     .y(function(d) { return scaleY(d["_yhat_"]); });
        
        g.append("g").attr("transform", "translate(0," + heightAvail + ")").call(d3.axisBottom(scaleX));
        g.append("g").call(d3.axisLeft(scaleY));

        var per_id_model= d3.nest().key(function(d){return d['_ids_']+ '|' + d['_label_']}).entries(dataVar);
            
        g.selectAll('path.linechart').data(per_id_model).enter().append("path").attr('class', 'linechart')
         .attr('id', function(x) {return 'linechart-' + x.key})
         .attr("fill", "none")                                                         //[0] to get array inside structure {{cos}}
         .attr("stroke", function(x) { return scaleColor(dataObs.filter(function(d) {return (d['_ids_']+ '|' + d['_label_']) == x.key; })[0][color])}) 
         .attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5)
         .attr("d", function(x){return line(x.values)});
         
        };


    var renderPlot = function(data, dataObs, variables, color, height, width, htmlSectionId){
      
        if(!htmlSectionId){ htmlSectionId = 'body'}
        if(!height){height = 400}
        if(!width){width - 600}
        
        var scaleCol = scaleColor(dataObs, color);
        var cells = init(htmlSectionId, variables, color, scaleCol, height, width);
        var widthAvail = cells.cellsWidth - margin.left - margin.right,
            heightAvail = cells.cellsHeight - margin.top - margin.bottom,
            scaleY = d3.scaleLinear().rangeRound([heightAvail, 0]);    
                        
        scaleY.domain(d3.extent(data, function(d) { return d["_yhat_"]; }));

        cells.cells.each(
            function(d,i){  
                if(variables[i]){ // do not plot chart for empty cell
                    icePlot(d3.select(this), cells.cellsHeight, cells.cellsWidth, data, dataObs, variables[i], color, scaleY, heightAvail, widthAvail, scaleCol);                            
                } 
            }
        );

    };


    return {

      renderValue: function(x) {
        
        console.log('renderValue, id'+id);
        
        x.settings.selected_variables = d3.map(x.settings.selected_variables, function(d){return d;}).keys();

        renderPlot(x.data, x.dataObs, x.settings.selected_variables, x.settings.color, height, width, id);
        
        instance.x = x;

      },

      resize: function(width, height) {
        
                
        console.log('resize, id'+id);
        
       renderPlot(instance.x.data, instance.x.dataObs, instance.x.settings.selected_variables, instance.x.settings.color, height, width, id);
        
        // this.renderValue(instance.data);

      }

    };
  }
});