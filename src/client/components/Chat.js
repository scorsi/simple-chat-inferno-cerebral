import {Component} from 'inferno'
import {connect} from '@cerebral/inferno'
import {state, signal} from 'cerebral/lib/tags'


export default connect({
    messages: state`messages`,
    sendMessage: signal`sendMessage`
  },
  class Chat extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: ''
      };
    }

    setValue(value) {
      this.setState({
        value
      });
    };

    sendMessage() {
      if (this.state.value === '') return;
      this.props.sendMessage({message: this.state.value});
      this.setState({value: ''});
    }

    render() {
      const {messages} = this.props;
      return (
        <div>
          <ul>
            {messages.map((message, key) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
          <hr/>
          <input value={this.state.value} onInput={(e) => this.setValue(e.target.value)}/>
          <button
            onClick={() => this.sendMessage()}
          >
            Send message
          </button>
        </div>
      );
    }
  }
)
