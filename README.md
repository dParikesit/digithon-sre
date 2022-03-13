# Kindboard

Sistem keyboard pintar yang menggunakan model TensorFlow/toxicity untuk mendeteksi kalimat berunsur toksik berdasarkan konteksnya.

Requirement : 

 [Node v17+](https://nodejs.org/en/download/) <br>
 [Nvidia GPU Drivers](https://www.nvidia.com/Download/index.aspx?lang=en-us) Version >450.x <br>
 [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit-archive)Version 11.2 <br>
 [cuDNN SDK] (https://developer.nvidia.com/rdp/cudnn-download) Version 8.1.0 <br>

# How to Run : 
A. Toxicity Filter Backend (tfjs/toxicity) : run ```yarn dev``` on *digithon-sre* as the active folder.
B. ReactJS Front-end : run ```yarn``` followed by ```yarn start``` on *frontend* as the active folder.
