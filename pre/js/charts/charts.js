//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage, setCustomCanvas, setChartCustomCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Desarrollo de funciones asociadas al gráfico > Título, subtítulo, notas, fuente de datos
    document.getElementById('title').textContent = 'Figura 1.1. Evolución de la población de 65 y más años. España, 1908-2035';
    document.getElementById('subtitle').textContent = 'Muestra de datos en valores absolutos (en miles de personas) y en valores relativos (en %).';
    document.getElementById('data-source').textContent = 'Human Mortality Database (HMD): datos entre 1908 y 2019. Instituto Nacional de Estadística: Estadísticas del Padrón continuo (2020-2021) y proyecciones de población (2022-2035).';
    document.getElementById('data-note').textContent = 'De 1908 a 2021 los datos son reales. De 2022 a 2035 son proyecciones.';

    //Creación de otros elementos relativos al gráfico que no requieran lectura previa de datos > Selectores múltiples o simples, timelines, etc 

    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_demografia_1_1/main/data/evolucion_mayores_1908_2035.csv', function(error,data) {
        if (error) throw error;

        console.log(data);

        //Uso de dos botones para ofrecer datos absolutos y en miles

        //Gráfico sencillo de barras apiladas

        /////
        /////
        // Resto
        /////
        /////
        
        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_demografia_1_1','tabla_poblacion_municipios');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('evolucion_poblacion_65ymas');

        //Captura de pantalla de la visualización
        setChartCanvas();
        setCustomCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('evolucion_poblacion_65ymas');
            setChartCustomCanvasImage('evolucion_poblacion_65ymas');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}