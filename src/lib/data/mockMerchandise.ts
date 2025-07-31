/**
         * @file mockMerchandise.ts
         * @purpose Provides placeholder merchandise data for offline/fallback scenarios
         * 
         * @dependencies
         * - $lib/api/apiClient: For Merchandise and MerchandiseImage type definitions
         *
         * @notes
         * - Data represents realistic museum merchandise items
         * - Used when backend API is unreachable
         * - Includes proper translations, pricing, inventory, and image structure
         * - Matches exact Merchandise interface specification
         */

import type { Merchandise, MerchandiseImage } from '$lib/api/apiClient';

/**
 * Mock merchandise images for fallback scenarios
 * Provides realistic image data structure when API is unavailable
 */
const mockImages: Record<string, MerchandiseImage[]> = {
  'mock-001': [
    {
      id: 'img-001-1',
      image_path: '/images/merchandise/vaso-greco-1.jpg',
      is_primary: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'img-001-2',
      image_path: '/images/merchandise/vaso-greco-2.jpg',
      is_primary: false,
      created_at: '2024-01-15T10:05:00Z'
    }
  ],
  'mock-002': [
    {
      id: 'img-002-1',
      image_path: '/images/merchandise/libro-storia-museo.jpg',
      is_primary: true,
      created_at: '2024-01-14T09:00:00Z'
    }
  ],
  'mock-003': [
    {
      id: 'img-003-1',
      image_path: '/images/merchandise/collana-bizantina-1.jpg',
      is_primary: true,
      created_at: '2024-01-13T14:30:00Z'
    },
    {
      id: 'img-003-2',
      image_path: '/images/merchandise/collana-bizantina-2.jpg',
      is_primary: false,
      created_at: '2024-01-13T14:35:00Z'
    }
  ],
  'mock-004': [
    {
      id: 'img-004-1',
      image_path: '/images/merchandise/ceramica-calabrese.jpg',
      is_primary: true,
      created_at: '2024-01-12T16:45:00Z'
    }
  ],
  'mock-005': [
    {
      id: 'img-005-1',
      image_path: '/images/merchandise/sciarpa-archeologica.jpg',
      is_primary: true,
      created_at: '2024-01-11T11:20:00Z'
    }
  ],
  'mock-006': [
    {
      id: 'img-006-1',
      image_path: '/images/merchandise/catalogo-collezione.jpg',
      is_primary: true,
      created_at: '2024-01-10T13:15:00Z'
    }
  ],
  'mock-007': [
    {
      id: 'img-007-1',
      image_path: '/images/merchandise/orecchini-dorati-1.jpg',
      is_primary: true,
      created_at: '2024-01-09T08:30:00Z'
    },
    {
      id: 'img-007-2',
      image_path: '/images/merchandise/orecchini-dorati-2.jpg',
      is_primary: false,
      created_at: '2024-01-09T08:32:00Z'
    }
  ],
  'mock-008': [
    {
      id: 'img-008-1',
      image_path: '/images/merchandise/statua-miniatura.jpg',
      is_primary: true,
      created_at: '2024-01-08T15:00:00Z'
    }
  ],
  'mock-009': [
    {
      id: 'img-009-1',
      image_path: '/images/merchandise/borsa-museo.jpg',
      is_primary: true,
      created_at: '2024-01-07T12:45:00Z'
    }
  ],
  'mock-010': [
    {
      id: 'img-010-1',
      image_path: '/images/merchandise/piatto-decorativo.jpg',
      is_primary: true,
      created_at: '2024-01-06T17:20:00Z'
    }
  ],
  'mock-011': [
    {
      id: 'img-011-1',
      image_path: '/images/merchandise/guida-archeologica.jpg',
      is_primary: true,
      created_at: '2024-01-05T10:10:00Z'
    }
  ],
  'mock-012': [
    {
      id: 'img-012-1',
      image_path: '/images/merchandise/braccialetto-antico.jpg',
      is_primary: true,
      created_at: '2024-01-04T14:55:00Z'
    }
  ]
};

/**
 * Mock merchandise data for fallback scenarios
 * Provides a realistic collection of museum items when API is unavailable
 */
export const mockMerchandise: Merchandise[] = [
  {
    id: 'mock-001',
    name_translations: {
      it: 'Riproduzione Vaso Greco Antico',
      en: 'Ancient Greek Vase Reproduction'
    },
    description_translations: {
      it: 'riproduzioni',
      en: 'reproductions'
    },
    price: 45.00,
    inventory: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    images: mockImages['mock-001']
  },
  {
    id: 'mock-002',
    name_translations: {
      it: 'Libro "Storia del Museo Zungri"',
      en: 'Book "History of Zungri Museum"'
    },
    description_translations: {
      it: 'libri',
      en: 'books'
    },
    price: 25.00,
    inventory: 15,
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
    images: mockImages['mock-002']
  },
  {
    id: 'mock-003',
    name_translations: {
      it: 'Collana Ispirata all\'Arte Bizantina',
      en: 'Byzantine Art Inspired Necklace'
    },
    description_translations: {
      it: 'gioielli',
      en: 'jewelry'
    },
    price: 75.00,
    inventory: 3,
    created_at: '2024-01-13T14:30:00Z',
    updated_at: '2024-01-13T14:30:00Z',
    images: mockImages['mock-003']
  },
  {
    id: 'mock-004',
    name_translations: {
      it: 'Ceramica Tradizionale Calabrese',
      en: 'Traditional Calabrian Ceramic'
    },
    description_translations: {
      it: 'ceramiche',
      en: 'ceramics'
    },
    price: 65.00,
    inventory: 5,
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    images: mockImages['mock-004']
  },
  {
    id: 'mock-005',
    name_translations: {
      it: 'Sciarpa con Motivi Archelogici',
      en: 'Archaeological Motifs Scarf'
    },
    description_translations: {
      it: 'tessili',
      en: 'textiles'
    },
    price: 35.00,
    inventory: 12,
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    images: mockImages['mock-005']
  },
  {
    id: 'mock-006',
    name_translations: {
      it: 'Catalogo Collezione Permanente',
      en: 'Permanent Collection Catalog'
    },
    description_translations: {
      it: 'libri',
      en: 'books'
    },
    price: 30.00,
    inventory: 20,
    created_at: '2024-01-10T13:15:00Z',
    updated_at: '2024-01-10T13:15:00Z',
    images: mockImages['mock-006']
  },
  {
    id: 'mock-007',
    name_translations: {
      it: 'Orecchini Dorati Antichi',
      en: 'Ancient Golden Earrings'
    },
    description_translations: {
      it: 'gioielli',
      en: 'jewelry'
    },
    price: 55.00,
    inventory: 4,
    created_at: '2024-01-09T08:30:00Z',
    updated_at: '2024-01-09T08:30:00Z',
    images: mockImages['mock-007']
  },
  {
    id: 'mock-008',
    name_translations: {
      it: 'Statua Riprodotta in Miniatura',
      en: 'Miniature Reproduced Statue'
    },
    description_translations: {
      it: 'riproduzioni',
      en: 'reproductions'
    },
    price: 85.00,
    inventory: 2,
    created_at: '2024-01-08T15:00:00Z',
    updated_at: '2024-01-08T15:00:00Z',
    images: mockImages['mock-008']
  },
  {
    id: 'mock-009',
    name_translations: {
      it: 'Borsa di Tela con Logo Museo',
      en: 'Canvas Bag with Museum Logo'
    },
    description_translations: {
      it: 'tessili',
      en: 'textiles'
    },
    price: 20.00,
    inventory: 25,
    created_at: '2024-01-07T12:45:00Z',
    updated_at: '2024-01-07T12:45:00Z',
    images: mockImages['mock-009']
  },
  {
    id: 'mock-010',
    name_translations: {
      it: 'Piatto Decorativo Tradizionale',
      en: 'Traditional Decorative Plate'
    },
    description_translations: {
      it: 'ceramiche',
      en: 'ceramics'
    },
    price: 40.00,
    inventory: 7,
    created_at: '2024-01-06T17:20:00Z',
    updated_at: '2024-01-06T17:20:00Z',
    images: mockImages['mock-010']
  },
  {
    id: 'mock-011',
    name_translations: {
      it: 'Guida Archeologica della Calabria',
      en: 'Archaeological Guide of Calabria'
    },
    description_translations: {
      it: 'libri',
      en: 'books'
    },
    price: 22.00,
    inventory: 18,
    created_at: '2024-01-05T10:10:00Z',
    updated_at: '2024-01-05T10:10:00Z',
    images: mockImages['mock-011']
  },
  {
    id: 'mock-012',
    name_translations: {
      it: 'Braccialetto Intrecciato Antico',
      en: 'Ancient Braided Bracelet'
    },
    description_translations: {
      it: 'gioielli',
      en: 'jewelry'
    },
    price: 48.00,
    inventory: 6,
    created_at: '2024-01-04T14:55:00Z',
    updated_at: '2024-01-04T14:55:00Z',
    images: mockImages['mock-012']
  }
];

/**
 * Gets mock merchandise data with optional filtering
 * @param category - Optional category filter
 * @returns Array of mock merchandise items
 */
export function getMockMerchandise(category?: string): Merchandise[] {
  if (!category || category === 'all') {
    return mockMerchandise;
  }

  return mockMerchandise.filter(item => {
    const itemCategory = item.description_translations?.['it']?.toLowerCase() || '';
    return itemCategory === category.toLowerCase();
  });
}

/**
 * Gets the primary image for a merchandise item
 * @param merchandise - The merchandise item
 * @returns Primary image or null if not found
 */
export function getPrimaryImage(merchandise: Merchandise): MerchandiseImage | null {
  if (!merchandise.images || merchandise.images.length === 0) {
    return null;
  }

  const primaryImage = merchandise.images.find(img => img.is_primary);
  return primaryImage || merchandise.images[0];
}

/**
 * Generates a fallback state indicator for the UI
 * @returns Object with fallback mode information
 */
export function getFallbackModeInfo() {
  return {
    isOfflineMode: true,
    message: 'Modalità Offline - Dati dimostrativi',
    description: 'Il collegamento al server non è disponibile. Questi sono prodotti dimostrativi.',
    timestamp: new Date().toISOString()
  };
}