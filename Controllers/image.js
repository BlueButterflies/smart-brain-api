const PAT = '65994726c8584070ab887847455b1490';
const USER_ID = 'fver1b6m1eh4';
const APP_ID = 'test';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);


const handleApiCall = (req,res) =>{
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                {
                    data: {
                        image: {
                            url: req.body.input,
                            // base64: imageBytes,
                            allow_duplicate_url: true
                        }
                    }
                }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
    
            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }

            res.json(response)
        }
    );
//   + 'face-detection' + "/outputs", 
//   clarifaiRequest(req.body.input))
// 	.then(result => result.json())
// 	.then(data => {
// 		  res.json(data);
// 	})
// 	.catch(err => res.status(400).json('unable to work with API'));
}

const handlerImagePut = (req, res, db) => {
    const { id } = req.body;
  
    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
        res.json(entries[0].entries);
      })
      .catch(err => {
        res.status(404).json('unable to get entries');
      })
  }


  module.exports = {
    handlerImagePut: handlerImagePut,
    handleApiCall: handleApiCall
  }