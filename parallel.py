import pandas as pd
import plotly.express as px

# Load the data
df = pd.read_csv('./Dataset_VisContest_Rapid_Alloy_development_v1.tsv', sep='\t')
headers = df.columns.tolist()
inputs = df.iloc[:, :6]
class_column = df.iloc[:, 19]
inputs[headers[19]] = class_column
dimensions = list(inputs.columns[:-1])
print(inputs)
fig = px.parallel_coordinates(
    inputs, 
    dimensions = dimensions,
    color=headers[19],
    labels={col: col for col in inputs.columns},
    color_continuous_scale='Viridis', 
    title="Parallel Coordinates Plot"
)


# Show the plot
fig.show()