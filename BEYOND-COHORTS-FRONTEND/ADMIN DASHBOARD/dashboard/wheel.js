 // ✅ Data — replace with your API call later
  const cohortData = [50, 10, 20];
  const cohortColors  = ['#534AB7', '#1D9E75', '#D85A30'];
  const cohortDark    = ['#3C3489', '#0F6E56', '#993C1D'];
  const cohortLabels  = ['Cohort 1', 'Cohort 2', 'Cohort 3'];
  const total = cohortData.reduce((a, b) => a + b, 0);

  // ✅ Update legend percentages
  const ids = ['cohort1Percent', 'cohort2Percent', 'cohort3Percent'];
  cohortData.forEach((val, i) => {
    document.getElementById(ids[i]).textContent =
      Math.round(val / total * 100) + '%';
  });

  // ✅ Build chart
  const ctx = document.getElementById('cohortChart');
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cohortLabels,
      datasets: [
        {
          data: cohortData,
          backgroundColor: cohortColors,
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 12,
        },
        {
          // 3D shadow layer
          data: cohortData,
          backgroundColor: cohortDark,
          borderColor: '#ffffff',
          borderWidth: 3,
          weight: 0.22,
          hoverOffset: 12,
        }
      ]
    },
    options: {
      responsive: false,
      cutout: '62%',
      rotation: -90,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex !== 0) return null;
              const val = ctx.parsed;
              return ` ${val} users (${Math.round(val / total * 100)}%)`;
            },
            title: (items) => cohortLabels[items[0].dataIndex]
          },
          displayColors: false,
          backgroundColor: '#ffffff',
          titleColor: '#2c2c2a',
          bodyColor: '#5f5e5a',
          borderColor: 'rgba(0,0,0,0.12)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        }
      },
      onHover: (evt, elements) => {
        const label  = document.getElementById('centerLabel');
        const number = document.getElementById('totalUsers');
        if (elements.length && elements[0].datasetIndex === 0) {
          const i = elements[0].index;
          label.textContent  = cohortLabels[i];
          number.textContent = cohortData[i];
        } else {
          label.textContent  = 'Total';
          number.textContent = total;
        }
      }
    }
  });

  // ✅ Legend hover highlight
  document.querySelectorAll('.legend-item').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const i = +row.dataset.index;
      chart.data.datasets[0].backgroundColor =
        cohortColors.map((c, j) => j === i ? c : c + '40');
      chart.data.datasets[1].backgroundColor =
        cohortDark.map((c, j) => j === i ? c : c + '40');
      chart.update('none');
    });
    row.addEventListener('mouseleave', () => {
      chart.data.datasets[0].backgroundColor = cohortColors;
      chart.data.datasets[1].backgroundColor = cohortDark;
      chart.update('none');
      document.getElementById('centerLabel').textContent = 'Total';
      document.getElementById('totalUsers').textContent  = total;
    });
  });

// When your backend is ready, replace the top data line:
// javascript// Replace this
// const cohortData = [50, 10, 20];

// // With this
// const res = await fetch("http://localhost:5000/api/users/cohort-stats", {
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
// });
// const stats = await res.json();
// const cohortData = [stats.cohort1, stats.cohort2, stats.cohort3];