import Way from "../../models/osm/wayModel.ts";
import Node from "../../models/osm/nodeModel.ts";

/**
 * Retrieves the destination based on the given ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {object} The retrieved destination.
 */
export const getDestination = async (req, res) => {
    try {
      const id = req.params.id;
  
      let destination = await Way.findById(id);
  
      // If not found in Way, search in Node
      if (!destination) {
        destination = await Node.findById(id);
      }
  
      if (!destination) {
        return res.status(404).json({
          status: "fail",
          message: "No destination found with that ID",
        });
      }
  
      res.status(200).json({
        status: "success",
        data: {
          destination: destination,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  