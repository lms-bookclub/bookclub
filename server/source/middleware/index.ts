function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'Must be signed in to continue',
    });
  }
}

function requireAdmin(req, res, next) {
  if(req.user.roles.indexOf('ADMIN') > -1) {
    next();
  } else {
    res.status(403).json({
      message: 'Must be admin to continue',
    });
  }
}

function requireSelfOrAdmin(getId) {
  return (req, res, next) => {
    const id = getId(req);
    if(req.user._id.toString() === id.toString() || req.user.roles.indexOf('ADMIN') > -1) {
      next();
    } else {
      res.status(403).json({
        message: 'May not perform this action on a user other than yourself without admin privileges',
      });
    }
  }
}

function setReqDate(date) {
  return function(req, res, next) {
    if(!req.body.dates) {
      req.body.dates = {};
    }

    if(!req.body.dates[date]) {
      req.body.dates[date] = new Date().getTime();
    }

    next();
  }
}

export {
  requireAuthentication,
  requireAdmin,
  requireSelfOrAdmin,
  setReqDate,
};