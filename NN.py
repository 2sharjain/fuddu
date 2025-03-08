import torch
from torch import nn
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import math

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.two_layer = nn.Sequential( #Creating a 2 layer perceptron with Relu activation function
            nn.Linear(6,12),
            nn.ReLU(),
            nn.Linear(12,1) #For now training a separate network for every scalar field
        )

    def forward(self,x):
        logits = self.two_layer(x)
        return logits