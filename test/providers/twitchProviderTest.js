const twitchProvider = require("../../providers/data/twitchProvider.js");
const expect = require("chai").expect;
describe("getTrending", () => {
  let mockRequestFactory = responseData => {
    return (mockRequest = {
      responseData: null,
      get: () => {
        return new Promise((resolve, reject) => {
          if (!responseData) {
            return reject(new Error("Mock Request rejecting promise"));
          }
          return resolve(responseData);
        });
      }
    });
  };

  it("should return a clip that is well formatted", done => {
    responseData = {
      clips: [
        {
          name: "test clip"
        }
      ]
    };
    mockRequest = mockRequestFactory(responseData);
    twitchProvider
      .getTrending(mockRequest, "mockChannelName", "mockTwitchId")
      .then(clip => {
        expect(clip.name).to.equal("test clip");
        done();
      })
      .catch(done);
  });

  it("should reject promise if twitch data is missing clips", done => {
    responseData = {
      notClips: []
    };
    mockRequest = mockRequestFactory(responseData);
    twitchProvider
      .getTrending(mockRequest, "mockChannelName", "mockTwitchId")
      .then(clip => {
        done(new Error("Invalid success"));
      })
      .catch(err => {
        expect(err).to.be.an("error");
        expect(err.message).to.equal(
          "No clips for mockChannelName sent from twitch"
        );
        done();
      });
  });

  it("should reject promise if request lib rejects the promise", done => {
    responseData = null;
    mockRequest = mockRequestFactory(responseData);
    twitchProvider
      .getTrending(mockRequest, "mockChannelName", "mockTwitchId")
      .then(clip => {
        done(new Error("Invalid success"));
      })
      .catch(err => {
        expect(err.message).to.equal("Mock Request rejecting promise");
        done();
      });
  });
});
