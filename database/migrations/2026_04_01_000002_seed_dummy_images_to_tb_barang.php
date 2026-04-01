<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

return new class extends Migration
{
    /**
     * Update existing barang records to have dummy placeholder images.
     * Uses picsum.photos for reliable dummy images.
     */
    public function up(): void
    {
        // Set all existing barang with null icon to a placeholder image path
        // We'll use a seed-based placeholder that gives consistent images per item
        $barangs = DB::table('tb_barang')->orderBy('id_barang')->get(['id_barang', 'nama', 'icon']);

        foreach ($barangs as $barang) {
            if (empty($barang->icon)) {
                // Use a picsum placeholder URL as default (stored as URL path)
                $seed = $barang->id_barang % 100 + 1;
                DB::table('tb_barang')
                    ->where('id_barang', $barang->id_barang)
                    ->update(['icon' => "https://picsum.photos/seed/{$seed}/200/200"]);
            }
        }
    }

    public function down(): void
    {
        // Revert placeholder images back to null (only picsum ones)
        DB::table('tb_barang')
            ->where('icon', 'like', 'https://picsum.photos/seed/%')
            ->update(['icon' => null]);
    }
};
