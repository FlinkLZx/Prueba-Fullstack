package com.example.convocatoriasBackend.convocation.domain.model;

import com.example.convocatoriasBackend.category.domain.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Convocation {

    private Long id;

    private String name;
    private String description;

    private LocalDate startDate;
    private LocalDate finishDate;

    private Integer spotsAvailable;

    private ConvocationStatus status;

    private List<Category> categories;

}
