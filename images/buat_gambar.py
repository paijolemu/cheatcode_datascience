import matplotlib.pyplot as plt

# Data
x = [5, 7, 8, 7, 2, 17, 2, 9, 4]
y = [99, 86, 87, 88, 111, 86, 103, 87, 94]

# Membuat plot
plt.scatter(x, y)
plt.xlabel('Usia Mobil')
plt.ylabel('Kecepatan')
plt.title('Scatter Plot: Usia vs Kecepatan Mobil')

# MENYIMPAN GAMBAR DENGAN NAMA YANG BENAR
plt.savefig("scatter_plot_example.png")
plt.show()
print("Gambar 'scatter_plot_example.png' telah disimpan!")