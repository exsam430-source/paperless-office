const jwt = require('jsonwebtoken');

let io;

// @desc    Initialize Socket.io
exports.initSocket = (socketIO) => {
  io = socketIO;

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id} (User: ${socket.userId})`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Join role-based room
    socket.on('joinRole', (role) => {
      socket.join(`role_${role}`);
      console.log(`User ${socket.userId} joined role room: ${role}`);
    });

    // Join department room
    socket.on('joinDepartment', (departmentId) => {
      socket.join(`dept_${departmentId}`);
      console.log(`User ${socket.userId} joined department room: ${departmentId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.io initialized');
};

// @desc    Emit Socket Event
exports.emitSocketEvent = (eventName, data) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }

  try {
    // Emit to all connected clients
    io.emit(eventName, {
      ...data,
      timestamp: data.timestamp || new Date()
    });

    // Emit to specific role if currentHolderRole exists
    if (data.currentHolderRole) {
      io.to(`role_${data.currentHolderRole}`).emit(eventName, {
        ...data,
        timestamp: data.timestamp || new Date()
      });
    }

    console.log(`📡 Socket event emitted: ${eventName}`);
  } catch (error) {
    console.error('Socket emit error:', error.message);
  }
};

// @desc    Emit to Specific User
exports.emitToUser = (userId, eventName, data) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }

  try {
    io.to(`user_${userId}`).emit(eventName, {
      ...data,
      timestamp: data.timestamp || new Date()
    });
  } catch (error) {
    console.error('Socket emit to user error:', error.message);
  }
};

// @desc    Emit to Specific Role
exports.emitToRole = (role, eventName, data) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }

  try {
    io.to(`role_${role}`).emit(eventName, {
      ...data,
      timestamp: data.timestamp || new Date()
    });
  } catch (error) {
    console.error('Socket emit to role error:', error.message);
  }
};

// @desc    Emit to Specific Department
exports.emitToDepartment = (departmentId, eventName, data) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }

  try {
    io.to(`dept_${departmentId}`).emit(eventName, {
      ...data,
      timestamp: data.timestamp || new Date()
    });
  } catch (error) {
    console.error('Socket emit to department error:', error.message);
  }
};

// @desc    Get Socket.io Instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};