import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CovidDataService } from '../services/covid-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  covidData: any[] = [];
  chartLabels: string[] = [];
  datasets: any[] = [];
  barChart: any;

  public chartColors: any[] = [
    {
      backgroundColor: [
        '#003366',
        '#FF69B4',
        '#00BFFF',
        '#4BB543',
        '#DC143C',
        '#FF5F1F',
      ]
    }
  ];

  constructor(private covidService: CovidDataService) {}

  ngOnInit(): void {
    this.getCovidData();
  }

  getCovidData() {
    this.covidService.getCovidStatistics().subscribe(data => {
      if (data.length > 0) {
        this.covidData = data;

        this.chartLabels = this.covidData.map(entry => entry.Date);

        const dataKeys = Object.keys(this.covidData[0]).filter(key => key !== 'Date');

        this.datasets = dataKeys.map((key, index) => {

          const numBars = this.covidData.length;

          const backgroundColors = Array.from(
            { length: numBars },
            (_, i) => this.chartColors[0].backgroundColor[index % this.chartColors[0].backgroundColor.length]
          );

          const borderColors = Array.from(
            { length: numBars },
            (_, i) => this.chartColors[0].backgroundColor[index % this.chartColors[0].backgroundColor.length]
          );

          return {
            label: key,
            data: this.covidData.map(entry => Number(entry[key]) || 0),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          };
        });

        this.createChart();
      }
    });
  }

  createChart() {
    const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;

    if (ctx && this.chartLabels.length > 0 && this.datasets.length > 0) {
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: this.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }

          }
        }
      });
    } else {
      console.error('Chart creation failed: Missing data or canvas element');
    }
  }
}
