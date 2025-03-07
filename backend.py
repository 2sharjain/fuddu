from enum import verify
from flask import Flask, request, jsonify
from httpcore import Origin
from matplotlib.hatch import VerticalHatch
import numpy as np
import pandas as pd
from flask_cors import CORS
import pickle


app = Flask(__name__)
CORS(app)

SCALARS = ['KS1295[%]', '6082[%]', '2024[%]', 'bat-box[%]', '3003[%]', '4032[%]', 'Al', 'Si', 'Cu', 'Ni', 'Mg', 'Mn', 'Fe', 'Cr', 'Ti', 'Zr', 'V', 'Zn', 'Vf_FCC_A1', 'Vf_DIAMOND_A4', 'Vf_AL15SI2M4', 'Vf_AL3X', 'Vf_AL6MN', 'Vf_MG2ZN3', 'Vf_AL3NI2', 'Vf_AL3NI_D011', 'Vf_AL7CU4NI', 'Vf_AL2CU_C16', 'Vf_Q_ALCUMGSI', 'Vf_AL7CU2FE', 'Vf_MG2SI_C1', 'Vf_AL9FE2SI2', 'Vf_AL18FE2MG7SI10', 'eut. frac.[%]', 'eut. T ( C)', 'T_FCC_A1', 'T_DIAMOND_A4', 'T_AL15SI2M4', 'T_AL3X', 'T_AL6MN', 'T_MG2ZN3', 'T_AL3NI2', 'T_AL3NI_D011', 'T_AL7CU4NI', 'T_AL2CU_C16', 'T_Q_ALCUMGSI', 'T_AL7CU2FE', 'T_MG2SI_C1', 'T_AL9FE2SI2', 'T_AL18FE2MG7SI10', 'T(liqu)', 'T(sol)', 'delta_T', 'delta_T_FCC', 'delta_T_Al15Si2M4', 'delta_T_Si', 'CSC', 'YS(MPa)', 'hardness(Vickers)', 'CTEvol(1/K)(20.0-300.0 C)', 'Density(g/cm3)', 'Volume(m3/mol)', 'El.conductivity(S/m)', 'El. resistivity(ohm m)', 'heat capacity(J/(mol K))', 'Therm.conductivity(W/(mK))', 'Therm. diffusivity(m2/s)', 'Therm.resistivity(mK/W)', 'Linear thermal expansion (1/K)(20.0-300.0 C)', 'Technical thermal expansion (1/K)(20.0-300.0 C)']
filename_=''

df = ''
knn = ''
@app.route('/load_tsv', methods=['POST'])
def load_tsv():
    data = request.get_json()
    global knn
    # print(data)
    filename = data.get("filename")
    scalars = data.get("scalars")
    numHexagons = data.get("numHexagons")
    global filename_ 
    filename_ = data.get("filename")
    knn_name = filename_.replace(".tsv","")
    knn_name = knn_name.replace("./","")
    knn = np.load('./knn_'+knn_name+".npy")

    vertices, points, scalar_fields = getpointsforrendering(filename, scalars)
    return jsonify({'vertices': vertices, 'points': points, 'scalar_fields': scalar_fields})
    # return jsonify(vertices=vertices)


def _getpointsforrendering(filename, scalars):
    print(filename)
    vertices = []
    points = []
    scalar_feilds = []
    # df = pd.read_csv(filename, sep='\t')
    inputs = df.iloc[:, :6]
    input_np = np.array(inputs)
    input_np = input_np/100

    radius = 5
    for i in range(6):
        theta = (i*np.pi)/3
        vertices.append([radius*np.cos(theta),radius*np.sin(theta),SCALARS[i]])

    # with open("vertices.pkl", "wb") as file:
    #     pickle.dump(vertices, file)
    # vertices = np.array(vertices)
    for i in range(249999):
        x_coord = 0
        y_coord = 0
        for j in range(6):
            x_coord = x_coord + input_np[i][j]*vertices[j][0]
            y_coord = y_coord + input_np[i][j]*vertices[j][1]
        
        points.append([x_coord,y_coord, i])
    # points = np.array(points)
    with open("points.pkl", "wb") as file:
        pickle.dump(points, file)
    for scalar in scalars:
        col = df[scalar].tolist()

        scalar_feilds.append(col)

    return vertices, points, scalar_feilds


def getpointsforrendering(filename, scalars):
    print(filename)
    global df
    df = pd.read_csv(filename, sep='\t')

    if filename == "./Original.tsv":
        scalar_feilds = []



        with open("vertices.pkl", "rb") as file:
            vertices = pickle.load(file)

        with open("points.pkl", 'rb') as file:
            points =  pickle.load(file)

        for scalar in scalars:
            col = df[scalar].tolist()

            scalar_feilds.append(col)
    else:
        vertices = []
        points = []
        scalar_feilds = []
        inputs = df.iloc[:, :6]
        input_np = np.array(inputs)
        print(input_np.shape)
        # print(input_np.shape)
        # radius = 5
        # for i in range(6):
        #     theta = (i*np.pi)/3
        #     vertices.append([radius*np.cos(theta),radius*np.sin(theta),SCALARS[i]])
        
        with open("vertices.pkl", "rb") as file:
            vertices = pickle.load(file)

        
        for i in range(input_np.shape[0]):
            x_coord = 0
            y_coord = 0
            for j in range(6):
                x_coord = x_coord + input_np[i][j]*vertices[j][0]
                y_coord = y_coord + input_np[i][j]*vertices[j][1]
            
            points.append([x_coord,y_coord, i])
        # points = np.array(points)
        # with open("points.pkl", "wb") as file:
        #     pickle.dump(points, file)
        for scalar in scalars:
            col = df[scalar].tolist()

            scalar_feilds.append(col)


    return vertices, points, scalar_feilds



@app.route('/change_hexagon', methods=['POST'])
def change_hexagon():
    data = request.get_json()
    print(data)
    filename = data.get("filename")
    scalar = data.get("scalar_field")
    print("\n\n\n\n\n\n\n\n\n\n\n")
    print(scalar)
    print("\n\n\n\n\n\n\n\n\n\n\n")
    # df = pd.read_csv(filename, sep='\t')

    scalar_field = df[scalar].tolist()

    
    return jsonify({'scalar_field': scalar_field})

path_dict = {}

def get_next_point(index,col):
    global knn
    global path_dict
    k_nearest = knn[index]
    # df = pd.read_csv(filename,sep='\t')
    # Now need to find the index with the largest column value in k_nearest
    max = -1
    max_index = -1
    for i in range(1,len(k_nearest)):
        temp = df.iloc[k_nearest[i],col]
        if(temp>max and (k_nearest[i] not in path_dict)):
            max = temp
            max_index = k_nearest[i]
            path_dict[k_nearest[i]] = "dummy"
    
    return max_index
    
@app.route('/grad_forward', methods=['POST'])
def grad_forward():
    global path_dict
    data = request.get_json()
    id = data.get("index")
    col_name = data.get("column")
    id = int(id)
    col = df.columns.get_loc(col_name)
    for i in range(20):
        id = get_next_point(id,col)
    print("CHECK: ",id)
    print("PATH: ",path_dict)
    return jsonify({'grad_point': int(id)})

def get_prev_point(index,col):
    global knn
    global path_dict
    k_nearest = knn[index]
    # df = pd.read_csv(filename,sep='\t')
    # Now need to find the index with the largest column value in k_nearest
    min = 10000000000
    min_index = -1
    for i in range(1,len(k_nearest)):
        temp = df.iloc[k_nearest[i],col]
        if(temp<min and (k_nearest[i] not in path_dict)):
            min = temp
            min_index = k_nearest[i]
            path_dict[k_nearest[i]] = "dummy"
    
    return min_index
    
@app.route('/grad_backward', methods=['POST'])
def grad_backward():
    global path_dict
    data = request.get_json()
    id = data.get("index")
    col_name = data.get("column")
    id = int(id)
    col = df.columns.get_loc(col_name)
    for i in range(20):
        id = get_prev_point(id,col)
    print("CHECK: ",id)
    print("PATH: ",path_dict)
    return jsonify({'grad_point': int(id)})

@app.route('/contour', methods=['POST'])
def contour():
    data = request.get_json()
    value = data.get("value")
    col_name = data.get("column")
    print("DEBUG: ",col_name)
    value = float(value)
    #value = 530
    # df = pd.read_csv(filename_,sep='\t')

    col = df.columns.get_loc(col_name)
    # Find range of the column
    max = -1
    for i in range(df.shape[0]):
        if(df.iloc[i,col]>max):
            max = df.iloc[i,col]

    min = 10000000
    for i in range(df.shape[0]):
        if(df.iloc[i,col]<min):
            min = df.iloc[i,col]
    print(max)
    print(min)
    r = max - min
    index_lst = []
    for i in range(df.shape[0]):
        if(abs(df.iloc[i,col] - value)<=0.01*r):
            index_lst.append(i)
    
    return jsonify({'contour': index_lst})


@app.route('/field_range', methods=['POST'])
def field_range():
    print("\n\n\n\n\n\n\n\n\n")
    print(filename_)
    # df = pd.read_csv(filename_,sep='\t')
    # print(df)

    data = request.get_json()
    field_name = data.get("scalar_field")
    field = df.columns.get_loc(field_name)

    print(field)
    max_val = df.iloc[:,field].max()
    min_val = df.iloc[:,field].min()
    print(max)
    return jsonify({'max': max_val, 'min': min_val})

@app.route('/empty_path', methods=['POST'])
def empty_path():
    global path_dict
    path_dict = {}
    print(path_dict)
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)