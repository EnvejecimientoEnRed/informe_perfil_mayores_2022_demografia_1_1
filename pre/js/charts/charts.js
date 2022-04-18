//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
import { getInTooltip, getOutTooltip, positionTooltip } from '../modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setCustomCanvas, setChartCustomCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42';
let tooltip = d3.select('#tooltip');

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_demografia_1_1/main/data/evolucion_mayores_1908_2035_v2.csv', function(error,data) {
        if (error) throw error;

        //Gráfico sencillo de barras apiladas
        let currentType = 'Total';

        //Declaramos fuera las variables genéricas
        let margin = {top: 10, right: 12.5, bottom: 20, left: 72.5},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let gruposAbsolutos = ['Total_entre65y79','Total_mas80'];
        let gruposPorcentuales = ['porc_total_entre65y79','porc_total_mas80'];

        let x = d3.scaleBand()
            .domain(d3.map(data, function(d){ return d.Periodo; }).keys())
            .range([0, width])
            .padding([0.2]);

        let xAxis = d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ if(i == 0 || i == 25 || i == 50 || i == 75 || i == 100 || i == data.length - 1){ return d; } }));
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        let y = d3.scaleLinear()
            .domain([0, 13000000])
            .range([height, 0]);

        let yAxis = function(svg) {
            svg.call(d3.axisLeft(y).ticks(5).tickFormat(function(d,i) { return numberWithCommas2(d); }))
        }

        svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

        let color = d3.scaleOrdinal()
            .domain(gruposAbsolutos)
            .range([COLOR_PRIMARY_1,COLOR_PRIMARY_2]);

        let stackedDataAbsolutos = d3.stack()
            .keys(gruposAbsolutos)
            (data);
        
        let stackedDataPorcentuales = d3.stack()
            .keys(gruposPorcentuales)
            (data);
        
        function init() {
            svg.append("g")
                .attr('class','chart-g')
                .selectAll("g")
                .data(stackedDataAbsolutos)
                .enter()
                .append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                    .attr("x", function(d) { return x(d.data.Periodo); })
                    .attr("y", function(d) { return y(0); })
                    .attr("height", function(d) { return 0; })
                    .attr("width",x.bandwidth())
                    .on('mouseover', function(d,i,e) {

                    })
                    .on('mouseout', function(d,i,e) {

                    })
                    .transition()
                    .duration(2000)
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); });                    
        }

        function setChart(type) {
            if(type != currentType) {
                if (type == 'Total') {
                    //Escala Y
                    y.domain([0,13000000]);
                    svg.select('.yaxis').call(d3.axisLeft(y).ticks(5).tickFormat(function(d,i) { return numberWithCommas2(d); }));

                    //Colores
                    color.domain(gruposAbsolutos);

                    //Datos
                    svg.select('.chart-g')
                        .remove();

                    svg.append("g")
                        .attr('class','chart-g')
                        .selectAll("g")
                        .data(stackedDataAbsolutos)
                        .enter()
                        .append("g")
                        .attr("fill", function(d) { return color(d.key); })
                        .selectAll("rect")
                        .data(function(d) { return d; })
                        .enter()
                        .append("rect")
                            .attr("x", function(d) { return x(d.data.Periodo); })
                            .attr("y", function(d) { return y(0); })
                            .attr("height", function(d) { return 0; })
                            .attr("width",x.bandwidth())
                            .transition()
                            .duration(2000)
                            .attr("y", function(d) { return y(d[1]); })
                            .attr("height", function(d) { return y(d[0]) - y(d[1]); });
                } else {
                    //Escala Y
                    y.domain([0,30]);
                    svg.select('.yaxis').call(d3.axisLeft(y).ticks(5));

                    //Colores
                    color.domain(gruposPorcentuales);

                    //Datos
                    svg.select('.chart-g')
                        .remove();

                    svg.append("g")
                        .attr('class','chart-g')
                        .selectAll("g")
                        .data(stackedDataPorcentuales)
                        .enter()
                        .append("g")
                        .attr("fill", function(d) { return color(d.key); })
                        .selectAll("rect")
                        .data(function(d) { return d; })
                        .enter()
                        .append("rect")
                            .attr("x", function(d) { return x(d.data.Periodo); })
                            .attr("y", function(d) { return y(0); })
                            .attr("height", function(d) { return 0; })
                            .attr("width",x.bandwidth())
                            .transition()
                            .duration(2000)
                            .attr("y", function(d) { return y(d[1]); })
                            .attr("height", function(d) { return y(d[0]) - y(d[1]); });
                }
            }            
        }

        function animateChart() {
            svg.select(".chart-g")
                .remove();
            
            svg.append("g")
                .attr('class','chart-g')
                .selectAll("g")
                .data(currentType == 'Total' ? stackedDataAbsolutos : stackedDataPorcentuales)
                .enter()
                .append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                    .attr("x", function(d) { return x(d.data.Periodo); })
                    .attr("y", function(d) { return y(0); })
                    .attr("height", function(d) { return 0; })
                    .attr("width",x.bandwidth())
                    .transition()
                    .duration(2500)
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); });
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Uso de dos botones para ofrecer datos absolutos y en miles
        document.getElementById('data_absolutos').addEventListener('click', function() {
            //Cambiamos color botón
            document.getElementById('data_porcentajes').classList.remove('active');
            document.getElementById('data_absolutos').classList.add('active');

            //Cambiamos gráfico
            setChart('Total');

            //Cambiamos valor actual
            currentType = 'Total';
        });

        document.getElementById('data_porcentajes').addEventListener('click', function() {
            //Cambiamos color botón
            document.getElementById('data_porcentajes').classList.add('active');
            document.getElementById('data_absolutos').classList.remove('active');

            //Cambiamos gráfico
            setChart('porc_total');

            //Cambiamos valor actual
            currentType = 'Porcentual';
        });
        
        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_demografia_1_1','tabla_poblacion_municipios');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('evolucion_poblacion_65ymas');

        //Captura de pantalla de la visualización
        //setChartCanvas();
        setCustomCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            //setChartCanvasImage('evolucion_poblacion_65ymas');
            setChartCustomCanvasImage('evolucion_poblacion_65ymas');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}