import ReactDOM from 'react-dom'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { shallow } from "enzyme";
import App from './App';

Enzyme.configure({ adapter: new Adapter() })

it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
})

it('shallow renders app without crashing', () => {
  shallow(<App />);
});

it("renders correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
