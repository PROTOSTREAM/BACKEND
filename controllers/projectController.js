const Projects = require("../models/project");
const User = require("../models/user");

exports.findAllProjects = (req, res) => {
  Projects.find()
    .populate("user", "name")
    .exec((err, allProjects) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.status(200).json(allProjects);
    });
};

//TODO maybe not complete have a look at it...

exports.findProject = (req, res) => {
  const { category } = req.body;
  console.log(category);

  Projects.find({ category }, (err, projects) => {
    if (err) {
      return res.json(404).json({
        error: err,
      });
    }

    res.status(200).json(projects);
  });
};

exports.createProject = (req, res) => {
  const project = new Projects(req.body);
  req.profile.projects = undefined;
  project.user = req.profile;
  project.save((err, project) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    let projects = [];
    projects.push({
      _id: project._id,
      ProjectTitle: req.body.ProjectTitle,
      ProjectArea: req.body.ProjectArea,
      SubmissionDate: req.body.SubmissionDate,
      Technology: req.body.Technology,
      TeamMembers: req.body.TeamMembers,
      RollNumber: req.body.RollNumber,
      Section: req.body.Section,
      GuideName: req.body.GuideName,
    });

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { projects: projects } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.json({
            error: err,
          });
        }
      }
    );

    res.status(200).json(project);
  });
};

exports.getProjetByUserId = (req, res) => {
  user.findById();
};
