/**
 * Debug Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class DebugSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);

    app.on('app.understand.match', (data) => {
      this.debug([
        'Understand',
        'Collection: '+data.collection,
        'Matches: '+data.matches.length,
      ]);

      if(data.matches.length > 0) {
        for(let ii=0; ii<data.matches.length; ii++) {
          this.debug(data.matches[ii].result+' ('+data.matches[ii].confidence+')');
        }
      }

    });

    this.setup_listeners();
  }


  /**
   * Setup event listeners
   *
   * @access public
   * @return void
   */
  setup_listeners() {
    //Incoming messages from users
    this.app.on('incoming', (data) => {
      this.write_log('incoming', data.ident + "\t" + data.input.text);
    });

    //Messages that could not be parsed and sent to an intent
    this.app.on('unknown', (data) => {
      this.write_log('unknown', data.ident + "\t" + data.input.text);
    });

    //Successful match and call to an intent
    this.app.on('intent', (data) => {
      this.write_log('intent', data.ident + "\t" + data.identifier + '::' + data.action);
    });
  }


  /**
  * Write to a log file
  * 
  * @param string type
  * @param string msg
  * @access public
  * @return void
  */
  write_log(type, text) {
    //Disabled logging
    if (!Config.read('logging.enabled')) {
      return false;
    }

    var filename = this.app.Path.get('logs') + '/' + type + '/' + moment().format('MM-DD-YYYY') + '.txt'
    var line = moment().format('MM-DD-YYYY HH:mm:ss') + "\t" + text + "\n";

    fs.appendFile(filename, line, function (err) {
    });
  }


  debug(messages) {
    if(typeof messages !== "object") {
      messages = [messages];
    }

    for(let ii=0; ii<messages.length; ii++) {
      if(typeof messages[ii] == 'object') {
        messages[ii] = messages[ii].toString();
      }

      console.log('Debug'.magenta, messages[ii]);
    }
  }

}