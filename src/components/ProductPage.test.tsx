import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductPage from './ProductPage';

const mockProducts = [
  {
    id: 1,
    title: 'Produto 1',
    price: 100,
    description: 'Descrição do produto 1',
    images: ['imagem1.jpg'],
    category: {
      id: 1,
      name: 'Categoria 1',
      image: 'categoria1.jpg'
    }
  }
];

beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockProducts
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ProductPage', () => {
  it('should make an API request for each keystroke', async () => {
    render(<ProductPage />);

    const searchInput = screen.getByPlaceholderText('Pesquisar produtos...');

    await userEvent.type(searchInput, 'teste');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      'https://api.escuelajs.co/api/v1/products/?title=teste'
    );

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://api.escuelajs.co/api/v1/products/?title=t'
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://api.escuelajs.co/api/v1/products/?title=te'
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      'https://api.escuelajs.co/api/v1/products/?title=tes'
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      'https://api.escuelajs.co/api/v1/products/?title=test'
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      5,
      'https://api.escuelajs.co/api/v1/products/?title=teste'
    );
  });
});
