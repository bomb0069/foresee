// Generated by CoffeeScript 1.4.0
var core, coreModule, datastore, route, should, sinon;

should = require("should");

sinon = require("sinon");

coreModule = require("../../../src/core");

core = coreModule.core;

datastore = coreModule.datastore;

route = require("../../../src/route").route;

describe("route", function() {
  beforeEach(function() {
    sinon.stub(core, "addStory");
    sinon.stub(core, "listStories");
    return sinon.stub(core, "addParticipant");
  });
  afterEach(function() {
    core.addStory.restore();
    core.listStories.restore();
    return core.addParticipant.restore();
  });
  it('index points to right template and contains title', function() {
    return route.index(null, {
      render: function(filename, params) {
        filename.should.equal("index.ect");
        return params.title.should.equal("Foresee");
      }
    });
  });
  it('join points to right template with roomname parameter', function() {
    return route.join({
      params: {
        id: "bombRoom"
      },
      headers: {
        host: "any host"
      }
    }, {
      render: function(filename, params) {
        filename.should.equal("join.ect");
        params.id.should.equal("bombRoom");
        return params.socketUrl.should.equal("http://any host");
      }
    });
  });
  it('participant joined, send the "voteRefresh" message',function() {
    var roomName = "geeky", name = "a";
    var actualRoomName, actualName;
    core.addParticipant.withArgs(roomName, name);

    route.addParticipant({
      params: {
        room: roomName,
        name: name
      }
    }, {
      json: function(result) {
        actualRoomName = result.room;
        actualName = result.name;
        return;
      }
    });

    actualRoomName.should.equal(roomName);
    actualName.should.equal(name);
    core.addParticipant.calledOnce.should.be["true"];
    return core.addParticipant.calledWith(roomName, name).should.be["true"];
  });

  it('story/add calls method in core', function() {
    var listResult, newStory, roomName;
    datastore.clear();
    roomName = "someroom";
    newStory = "new story";
    listResult = ["old story", newStory];
    core.listStories.withArgs(roomName).returns(listResult);
    return route.addStory({
      params: {
        "room": roomName,
        "story": newStory
      }
    }, {
      send: function(result) {
        core.addStory.calledOnce.should.be["true"];
        core.addStory.calledWith(roomName, newStory).should.be["true"];
        return result.should.eql(listResult);
      }
    });
  });

  it('story list', function() {
    //given
    var listResult = ["old story"], roomName = "someroom";
    core.listStories.withArgs(roomName).returns(listResult);

    //when
    route.listStories({
      params: {
        "room": roomName
      }
    }, {
      send: function(result) {
        //then
        return result.should.eql(listResult);
      }
    });
  });

  it('joinRoom() should add participant and emit refresh', function() {
    var req = { params: { room: "room", name: "name" } };
    var res = jasmine.createSpyObj("res", ["json"]);
    var sockets = [ jasmine.createSpyObj("webSocket", ["emit"]) ];

    route.joinRoom(sockets)(req, res);

    expect(core.addParticipant.calledWith(req.params.room, req.params.name)).toBe(true);
    expect(res.json).toHaveBeenCalledWith({room: req.params.room, name: req.params.name});
  });


});
