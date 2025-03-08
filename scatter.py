import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize
from matplotlib import cm

# Load the data
df = pd.read_csv('./Dataset_VisContest_Rapid_Alloy_development_v1.tsv', sep='\t')
headers = df.columns.tolist()

# Select the input and output columns
input_x = df.iloc[:, 5]
input_y = df.iloc[:, 51]
#output = df.iloc[:, 68]

# Convert to numpy arrays
input_x = np.array(input_x)
input_y = np.array(input_y)
#output = np.array(output)

# Normalize the output values for colormap
#norm = Normalize(vmin=output.min(), vmax=output.max())

# Create a scatter plot with color based on the output
scatter = plt.scatter(input_x, input_y, s = 0.2)#, c=output, cmap='viridis', norm=norm)

# Add colorbar to the plot
#plt.colorbar(scatter, label=headers[68])

# Customize plot labels and title
plt.xlabel(headers[5])
plt.ylabel(headers[51])
plt.title('Scatter Plot')

# Show the plot
plt.show()
