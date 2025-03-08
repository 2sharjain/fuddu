import torch
from torch import nn
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import math
from NN import NeuralNetwork
def MSE_test(model,test,des,inputs):
    # Now to write the testing code on the last 50K points
    sum = 0
    for i in np.random.choice(test,1000):
        pred = model.forward(inputs[i])
        true = des[i]
        sum = sum + (abs(pred - true)*abs(pred - true))

    return sum/1000



# Now import the datasets
df = pd.read_csv('./Dataset_VisContest_Rapid_Alloy_development_v1.tsv',sep='\t')
inputs = df.iloc[:,:6] # Pick the first 6 columns
inputs = np.array(inputs) #Convert to numpy array
inputs = torch.tensor(inputs,dtype = torch.float32) #Convert to pytorch tensor
inputs = inputs/100 #Normalized inputs



for col in range(18,70):
    #We are training a different model in every iteration, so model parameters are intialized every time.
    model = NeuralNetwork()
    print(model)
    # Now determine the loss and and the optimizer
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)  # Optimizer
    criterion = nn.MSELoss()

    des = df.iloc[:,col] # This is the desired output, col determines the model we are training
    des = np.array(des)
    des = torch.tensor(des, dtype = torch.float32)

    #Doing the test-train split
    shuff = [i for i in range(249999)]
    np.random.shuffle(shuff)
    train = shuff[0:200000]
    test = shuff[200000:249999]

    #For plotting test error curve
    error_arr = []
    x_point = []
    count = 0

    #This is the training loop
    for i in train:
        if not math.isnan(des[i]):
        # Forward pass
            output = model.forward(inputs[i])

            # Compute loss
            loss = criterion(output, des[i])

            # Backward pass (PyTorch handles gradients automatically)
            optimizer.zero_grad()  # Clear previous gradients
            loss.backward()  # Compute gradients
            optimizer.step()  # Update model parameters
            #For obtianing the testing accuracy and loss plots
            if(count%1000 == 0):
                print("PROPERTY: ",col, " PROGRESS: ",count)
                x_point.append(count)
                error = MSE_test(model,test,des,inputs)
                error = error.detach().numpy()
                error_arr.append(error)
                print("TEST ERROR: ",error)

            count = count + 1

    plt.plot(x_point, error_arr)
    plt.title("Test Error")
    plt.xlabel("Training Examples")
    plt.ylabel("MSE")
    #plt.show()
    plt.savefig('./testing_accuracy_curves/property'+str(col))
    plt.close()
    torch.save(model, './trained_models/model_'+str(col))

