var allRemote = function(params,connectCallback){
    var self = this
    this.defaults = {
        appId: 'appNan',
        uniqueSessionId: 'SecretStringForConnection',
        host: {
            protocol:'http',
            domain: 'remoteall.org',
            port: '8888'
        }
    }
    this.options = $.extend(this.defaults,params);
    this.socket = io.connect(this.options.host.protocol+'://'+this.options.host.domain+':'+this.options.host.port);

    this.socket.on('connect', function () {
        self.socket.emit('set_session', self.options.appId, self.options.uniqueSessionId);
        if(connectCallback)
            connectCallback.call(self,arguments);
    })

    this.handlers = {
        recive_code: []
    }
    this.on = function(event,callback){
        this.handlers[event].push(callback);
    };
    this.off = function(event){
        this.handlers[event] = [];
    }
    this.trig = function(event,args){
        for (var key in this.handlers[event]) {
            var func = this.handlers[event][key];
            func.call(this,args);
        }
    }


    this.socket.on('recive_code',function(code){
        self.trig('recive_code',code);
    })
    this.sendCode = function(code){
        this.socket.emit('send_code',code);
    }
}
